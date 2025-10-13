import J from 'joi';

const contactsSchema = J.array().items(J.string()).required();
const toSchema = J.string().required();

export { contactsSchema, toSchema };
