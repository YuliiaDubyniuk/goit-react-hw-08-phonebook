import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { addContact } from 'redux/contactsSlice';
import { selectAllContacts } from 'redux/contactsSelectors';
import { toast } from 'react-toastify';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import css from './Form.module.css';

const schema = yup
  .object({
    name: yup.string().required().min(4),
    number: yup.string().min(8).required(),
  })
  .required()

export const Form = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const contactList = useSelector(selectAllContacts);
  const onSubmit = contact => {
    if (
      contactList.some(
        item => item.name === contact.name || item.number === contact.number
      )
    ) {
      toast.warning('This contact has already been added.');
      return;
    }
    dispatch(addContact(contact));
    reset();
  };

  return (
    <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
      <h2 className={css.title}>Add new contact</h2>
      <label className={css.label}>
        <span className={css.contactSpan}>Name:</span>
        <input
          id="contactName"
          placeholder="Enter contact name"
          className={css.contactInput}
          {...register('name', {type: "text"})}
        />
        {<p className={css.error}>{errors.name?.message}</p>}
      </label>
      <label className={css.label}>
        <span className={css.contactSpan}>Phone:</span>
        <input
          id="contactPhone"
          className={css.contactInput}
          placeholder="Enter phone number"
          {...register('number', {type: "tel"})}
        />
        {<p className={css.error}>{errors.number?.message}</p>}
      </label>
      <button className={css.formBtn} type="submit">
        Add contact
      </button>
    </form>
  );
};
