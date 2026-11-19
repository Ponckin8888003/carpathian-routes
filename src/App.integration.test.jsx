import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import App from "./App.jsx";
import { planService } from "./services/planService.js";
import { ServiceError } from "./services/ServiceError.js";
import { savedPlan, validInput } from "./test/fixtures.js";
import { deferred } from "./test/deferred.js";

// Підміняємо лише межу доступу до даних. App, провайдери, сторінки, форма
// й маршрути справжні. dataSource: 'api' ховає навчальну панель відмов mock.
vi.mock("./services/planService.js", () => ({
  dataSource: "api",
  planService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

beforeEach(() => {
  for (const method of Object.values(planService)) method.mockReset();
  planService.getAll.mockResolvedValue([{ ...savedPlan }]);
  planService.getById.mockResolvedValue({ ...savedPlan });
  planService.create.mockImplementation(async (input) => ({
    ...input,
    id: "plan-created",
  }));
  planService.update.mockImplementation(async (id, input) => ({
    ...input,
    id,
  }));
  planService.delete.mockResolvedValue(undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

function LocationProbe() {
  const location = useLocation();
  return (
    <output data-testid="location">
      {location.pathname}
      {location.search}
    </output>
  );
}

function renderApp(path = "/plans") {
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
      <LocationProbe />
    </MemoryRouter>,
  );
  return user;
}

async function fillForm(user) {
  fireEvent.change(await screen.findByLabelText("Дата походу"), {
    target: { value: validInput.date },
  });
  const days = screen.getByRole("spinbutton", { name: /Тривалість/ });
  await user.clear(days);
  await user.type(days, String(validInput.durationDays));
  await user.type(
    screen.getByRole("textbox", { name: /Нотатки до походу/ }),
    validInput.notes,
  );
  await user.click(
    screen.getByRole("checkbox", { name: /Потрібна порада щодо маршруту/ }),
  );
}

test("показує завантаження до отримання колекції", async () => {
  const pending = deferred();
  planService.getAll.mockReturnValueOnce(pending.promise);
  renderApp();

  expect(screen.getByText("Завантаження планів…")).toBeInTheDocument();
  expect(screen.queryByRole("table")).not.toBeInTheDocument();

  await act(async () => {
    pending.resolve([savedPlan]);
    await pending.promise;
  });

  expect(
    await screen.findByRole("cell", { name: "Говерла" }),
  ).toBeInTheDocument();
  expect(screen.queryByText("Завантаження планів…")).not.toBeInTheDocument();
});

test("після відмови читання повторно завантажує дані", async () => {
  planService.getAll
    .mockRejectedValueOnce(new ServiceError("Навчальна відмова читання."))
    .mockResolvedValueOnce([savedPlan]);
  const user = renderApp();

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Навчальна відмова читання.",
  );
  expect(screen.queryByRole("table")).not.toBeInTheDocument();
  expect(screen.queryByText(/Планів ще немає/)).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Спробувати ще раз" }));

  expect(
    await screen.findByRole("cell", { name: "Говерла" }),
  ).toBeInTheDocument();
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

test("успішний порожній список має окреме пояснення", async () => {
  planService.getAll.mockResolvedValueOnce([]);
  renderApp();

  expect(await screen.findByText(/Планів ще немає/)).toBeInTheDocument();
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.queryByRole("table")).not.toBeInTheDocument();
});

test.each([
  ["/plans/plan-test-001", "План походу: Говерла"],
  ["/plans/plan-test-001/edit", "Редагування плану"],
  ["/plans/plan-missing", "План не знайдено"],
  ["/plans/plan-missing/edit", "План не знайдено"],
  ["/plans/new?peakId=peak-missing", "Неможливо підготувати план"],
  ["/peaks/missing", "Вершину не знайдено"],
  ["/unknown-page", "404: сторінку не знайдено"],
])("адреса %s відкриває відповідний екран", async (path, title) => {
  renderApp(path);
  expect(
    await screen.findByRole("heading", { name: title }),
  ).toBeInTheDocument();
});

test("умови списку без збігів не змінюють джерело, а скидання повертає запис", async () => {
  const user = renderApp("/plans?q=немає_такого_збігу&sort=date-asc");

  expect(
    await screen.findByText("За вибраними умовами планів не знайдено."),
  ).toBeInTheDocument();
  expect(screen.queryByRole("table")).not.toBeInTheDocument();
  expect(planService.delete).not.toHaveBeenCalled();

  const resets = screen.getAllByRole("button", { name: "Скинути умови" });
  await user.click(resets[resets.length - 1]);

  expect(
    await screen.findByRole("cell", { name: "Говерла" }),
  ).toBeInTheDocument();
  expect(screen.getByTestId("location")).toHaveTextContent(/^\/plans$/);
  expect(planService.delete).not.toHaveBeenCalled();
});

test("невідоме значення фільтра в адресі не приховує плани", async () => {
  renderApp("/plans?advice=zzz&sort=constructor");

  expect(
    await screen.findByRole("cell", { name: "Говерла" }),
  ).toBeInTheDocument();
  expect(screen.getByLabelText("Порада щодо маршруту")).toHaveValue("");
  expect(screen.getByLabelText("Сортування")).toHaveValue("");
});

test("створює план і відкриває його підтверджені деталі", async () => {
  planService.getAll.mockResolvedValueOnce([]);
  const user = renderApp("/plans/new?peakId=hoverla");
  await fillForm(user);

  await user.click(screen.getByRole("button", { name: "Створити план" }));

  expect(
    await screen.findByRole("heading", { name: "План походу: Говерла" }),
  ).toBeInTheDocument();
  expect(screen.getByTestId("location")).toHaveTextContent(
    "/plans/plan-created",
  );
  expect(screen.getByText(validInput.notes)).toBeInTheDocument();
  expect(screen.getByText("План створено.")).toBeInTheDocument();
  expect(planService.create).toHaveBeenCalledTimes(1);
  expect(planService.create).toHaveBeenCalledWith(validInput);
  expect(
    screen.queryByRole("form", { name: "План походу" }),
  ).not.toBeInTheDocument();
});

test("некоректна форма не викликає сервіс запису", async () => {
  const user = renderApp("/plans/new?peakId=hoverla");
  await screen.findByRole("form", { name: "План походу" });

  await user.click(screen.getByRole("button", { name: "Створити план" }));

  expect(screen.getByText("Вкажіть дату походу.")).toBeInTheDocument();
  expect(planService.create).not.toHaveBeenCalled();
  expect(screen.getByTestId("location")).toHaveTextContent(
    "/plans/new?peakId=hoverla",
  );
});

test("відмова створення залишає чернетку й адресу", async () => {
  planService.create.mockRejectedValueOnce(
    new ServiceError("Не вдалося створити план."),
  );
  const user = renderApp("/plans/new?peakId=hoverla");
  await fillForm(user);

  await user.click(screen.getByRole("button", { name: "Створити план" }));

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Не вдалося створити план.",
  );
  expect(
    screen.getByRole("textbox", { name: /Нотатки до походу/ }),
  ).toHaveValue(validInput.notes);
  expect(screen.getByTestId("location")).toHaveTextContent(
    "/plans/new?peakId=hoverla",
  );
});

test("редагування зберігає id і показує нові поля в деталях", async () => {
  const user = renderApp("/plans/plan-test-001/edit");
  const notes = await screen.findByRole("textbox", {
    name: /Нотатки до походу/,
  });
  await user.clear(notes);
  await user.type(notes, "Оновлені нотатки до походу.");

  await user.click(screen.getByRole("button", { name: "Зберегти зміни" }));

  expect(
    await screen.findByRole("heading", { name: "План походу: Говерла" }),
  ).toBeInTheDocument();
  expect(planService.update).toHaveBeenCalledWith("plan-test-001", {
    ...validInput,
    notes: "Оновлені нотатки до походу.",
  });
  expect(screen.getByText("Оновлені нотатки до походу.")).toBeInTheDocument();
  expect(screen.getByTestId("location")).toHaveTextContent(
    /^\/plans\/plan-test-001$/,
  );
});

test("скасування діалогу не викликає видалення", async () => {
  vi.spyOn(window, "confirm").mockReturnValue(false);
  const user = renderApp("/plans/plan-test-001");
  await screen.findByRole("heading", { name: "План походу: Говерла" });

  await user.click(screen.getByRole("button", { name: "Видалити" }));

  expect(planService.delete).not.toHaveBeenCalled();
  expect(
    screen.getByRole("heading", { name: "План походу: Говерла" }),
  ).toBeInTheDocument();
});

test("відмова видалення залишає запис і поточну адресу", async () => {
  vi.spyOn(window, "confirm").mockReturnValue(true);
  planService.delete.mockRejectedValueOnce(
    new ServiceError("Не вдалося видалити план."),
  );
  const user = renderApp("/plans/plan-test-001");
  await screen.findByRole("heading", { name: "План походу: Говерла" });

  await user.click(screen.getByRole("button", { name: "Видалити" }));

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Не вдалося видалити план.",
  );
  expect(screen.getByText(savedPlan.notes)).toBeInTheDocument();
  expect(screen.getByTestId("location")).toHaveTextContent(
    "/plans/plan-test-001",
  );
  expect(planService.delete).toHaveBeenCalledWith(savedPlan.id);
});

test("підтверджене видалення вилучає саме вибраний план зі списку", async () => {
  vi.spyOn(window, "confirm").mockReturnValue(true);
  const other = { ...savedPlan, id: "plan-test-002", peakId: "syvulia" };
  planService.getAll.mockResolvedValueOnce([{ ...savedPlan }, other]);
  const user = renderApp("/plans");
  const table = await screen.findByRole("table");
  expect(
    within(table).getByRole("cell", { name: "Сивуля" }),
  ).toBeInTheDocument();

  await user.click(
    within(table).getByRole("button", { name: /Видалити\s*Сивуля/ }),
  );

  expect(planService.delete).toHaveBeenCalledWith("plan-test-002");
  expect(await screen.findByText("План видалено.")).toBeInTheDocument();
  expect(
    screen.queryByRole("cell", { name: "Сивуля" }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("cell", { name: "Говерла" })).toBeInTheDocument();
});
