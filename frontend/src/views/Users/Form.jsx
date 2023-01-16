import { useForm } from "react-hook-form";

export default function Form({ action }) {
  const { register, handleSubmit } = useForm({
    shouldUseNativeValidation: true,
  });

  const onSubmit = async (data) => action(data);

  return (
      <form className="login__form" onSubmit={handleSubmit(onSubmit)}>
        <input
          className="login__text-input" 
          type="text"
          placeholder="username"
          {...register("username", { required: "Enter username" })} />
        <input
          className="login__text-input"
          type="password"
          placeholder="password"
          {...register("password", { required: "Enter password" })}
        />
        <button className="login__submit-button" type="submit"> Submit </button>
      </form>
  );
}
