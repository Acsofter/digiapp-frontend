import React, { useEffect } from "react";
import {
  IoAlertCircle,
  IoCheckmarkCircleSharp,
  IoHelpCircleOutline,
} from "react-icons/io5";
import { useUserServices } from "../src/services/user.services";
import { Contexts } from "../src/services/Contexts";

export const FormPayment = ({ payment_id }: { payment_id?: number }) => {
  const { create_ticket, get_ticket, update_ticket, get_categories } =
    useUserServices();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [form, setForm] = React.useState<Ticket>({
    id: 0,
    category: {} as Category,
    description: "",
    colaborator: {} as User,
    payment: {} as Payment,
    created_at: "",
    updated_at: "",
    company: 0,
  });

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    let response: Ticket | false;
    if (payment_id) {
      response = await update_ticket({
        details: {
          id: form.id,
          category: form.category.id,
          payment: {
            amount: parseInt(form.payment.amount),
          },
          description: form.description,
        },
      });

      if (response) setForm(response);
    } else {
      response = await create_ticket({
        category: form.category.id,
        payment: parseInt(form.payment.amount),
        description: form.description,
      });
      if (response)
        setForm({
          id: 0,
          category: {} as Category,
          description: "",
          colaborator: {} as User,
          payment: {} as Payment,
          created_at: "",
          updated_at: "",
          company: 0,
        });
    }
    //  dispatch({ type: "SET_POPUP", payload: { open: false } });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await get_categories();
      if (response) setCategories(response);
    };

    const fetchTicket = async () => {
      if (!payment_id) return;
      const response = await get_ticket({ id: payment_id });
      if (response) setForm(response);
    };

    fetchTicket();
    fetchCategories();
  }, [payment_id]);

  return (
    <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-sm text-primary/60 pb-1">Total $</label>
          <input
            autoFocus={true}
            value={form.payment.amount ? form.payment.amount : NaN}
            onChange={(e) =>
              e.target.value &&
              setForm({
                ...form,
                payment: {
                  ...form.payment,
                  amount: e.target.value,
                },
              })
            }
            className="w-full px-2 text-sm py-6 h-5 border rounded-md focus:outline-none focus:ring-1 focus:ring-slate-200 peer transition-all duration-200"
            type="number"
            name="quantity"
            id="quantity"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-primary/60 pb-1">Categoria</label>
          <select
            defaultValue={"default"}
            value={form.category.id ? form.category.id : "default"}
            onChange={(e) =>
              e.target.value !== "default" &&
              setForm({
                ...form,
                category:
                  categories[
                    categories.findIndex(
                      (item) => item.id === parseInt(e.target.value)
                    )
                  ],
              })
            }
            className="w-full px-2 text-sm text-primary h-full  border rounded-md focus:outline-none focus:ring-1 focus:ring-slate-200 peer transition-all duration-200"
            name="category"
            id=""
          >
            <option value="default">Otros</option>
            {categories.map((item, index) => (
              <option value={item.id} key={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid">
        <div className="flex flex-col">
          <label className="text-sm text-primary/60 pb-1">Comentario</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="no-scrollbar w-full px-2 text-sm py-3 min-h-20 border rounded-md focus:outline-none focus:ring-1 focus:ring-slate-200 peer  duration-50 max-h-72"
            name="comment"
            id="comment"
          />
        </div>
      </div>

      {payment_id && (
        <div
          className={`peer transition-all duration-200 w-1/3 h-6 border rounded-md inline-flex justify-between items-center py-5 px-3 shadow-sm  bg-gradient-to-tr text-white hover:brightness-95 ${
            form.payment?.status === "1"
              ? "shadow-blue-100 border-blue-600   from-blue-400 to-blue-700"
              : "shadow-amber-100 border-amber-500   from-amber-300 to-amber-500 "
          }`}
        >
          <div>
            {!form.payment ? (
              <IoAlertCircle
                className={`peer-focus:cursor-pointer w-4 inline-block mr-2 `}
              />
            ) : (
              <IoCheckmarkCircleSharp
                className={`peer-focus:cursor-pointer w-4 inline-block mr-2 `}
              />
            )}
            <span className="text-sm">
              {form.payment?.status ? "Recibido" : "Pendiente"}
            </span>
          </div>
          <IoHelpCircleOutline className="w-4 h-4" />
        </div>
      )}

      {payment_id && (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col text-sm">
            <label className="text-sm text-primary/60 ">Creador por</label>
            <div className="w-full m ">
              <span>{form.colaborator.username}</span> ({" "}
              <span className="text-primary/60">{form.colaborator.email}</span>{" "}
              )
            </div>
          </div>
          <div className="flex flex-col  text-sm place-items-end">
            <label className=" text-primary/60 pb-1">Fecha</label>
            <span>{new Date(form.updated_at).toDateString()}</span>
          </div>
        </div>
      )}

      <button className="bg-primary-blue hover:bg-primary-blue/80 text-white px-5 p-2 rounded-md ">
        {payment_id ? "Actualizar" : "Añadir"}
      </button>
    </form>
  );
};
