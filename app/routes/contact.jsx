import {ContactForm} from '~/components/ContactForm';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Contact | Hydrogen'}];
};

export default function Contact() {
  return <ContactForm />;
}
