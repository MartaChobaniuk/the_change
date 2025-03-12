/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import styles from './ParticipateForm.module.scss';
import { useParams } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import { useAuth } from 'react-oidc-context';

type Props = {
  title: string;
  opportunityType: string;
  onClose: () => void;
};

export const ParticipateForm: React.FC<Props> = ({
  onClose,
  title,
  opportunityType,
}) => {
  const { eventId } = useParams<{ eventId: string }>();
  const auth = useAuth();
  const isAuthenticated = auth?.isAuthenticated ?? true;
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('eventForm');

      if (storedData) {
        setFormData(JSON.parse(storedData));
      }
    } catch (errorMes) {
      localStorage.removeItem('eventForm');
    }
  }, []);

  const validateFields = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const updatedForm = { ...prev, [name]: value };

      localStorage.setItem('eventForm', JSON.stringify(updatedForm));

      return updatedForm;
    });
  };

  const handlePhoneChange = (value: string) => {
    setFormData(prev => {
      const updatedForm = { ...prev, phone: value };

      localStorage.setItem('eventForm', JSON.stringify(updatedForm));

      return updatedForm;
    });
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    localStorage.removeItem('eventForm');
    setFormData({ name: '', phone: '', email: '' });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    if (!validateFields()) {
      setIsSubmitting(false);

      return;
    }

    try {
      const currentTime = new Date().toISOString();
      const dataToSend = {
        ...formData,
        title: title,
        opportunityType: opportunityType,
        eventId,
        currentTime: currentTime,
      };

      const response = await fetch(
        `https://dewvdtfd5m.execute-api.eu-north-1.amazonaws.com/dev/events/${eventId}/join`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend),
        },
      );

      if (response.ok) {
        setSuccessMessage('Data is send');
        localStorage.removeItem('eventForm');
        setFormData({ name: '', phone: '', email: '' });
        setTimeout(() => onClose(), 1500);
      } else {
        setErrorMessage('Data sent failed');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (errorMes: any) {
      setErrorMessage(errorMes);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateFields()) {
      setIsSubmitting(false);

      return;
    }

    try {
      const currentTime = new Date().toISOString();
      const token = localStorage.getItem('accessToken');
      const dataToSend = {
        ...formData,
        title: title,
        opportunityType: opportunityType,
        eventId,
        currentTime: currentTime,
      };

      const response = await fetch(
        `https://dewvdtfd5m.execute-api.eu-north-1.amazonaws.com/dev/authJoin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSend),
        },
      );

      if (response.ok) {
        setSuccessMessage('Data is send');
        localStorage.removeItem('eventForm');
        setFormData({ name: '', phone: '', email: '' });
        setTimeout(() => onClose(), 1500);
      } else {
        setErrorMessage('Data sent failed');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (errorMes: any) {
      setErrorMessage(errorMes);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <p className={styles['event-details__part-title']}>
        Leave us your contact information and we’ll get in touch.
      </p>
      <form
        onSubmit={e => {
          console.log('Form submitted, isAuthenticated:', isAuthenticated);
          if (isAuthenticated) {
            handleSubmitAuth(e);
          } else {
            handleSubmit(e);
          }
        }}
        className={styles['event-details__part-form']}
      >
        <input
          value={formData.name}
          onChange={handleChange}
          className={styles['event-details__part-input']}
          type="text"
          name="name"
          placeholder="Your full name"
          required
        />
        <div className={styles['event-details__part-line']}></div>
        {errors.name && !formData.name && (
          <p className={styles['event-details__part-error']}>{errors.name}</p>
        )}
        <PhoneInput
          country={'ua'}
          value={formData.phone}
          onChange={handlePhoneChange}
          inputProps={{
            required: true,
            className: styles['transparent-input'],
          }}
          buttonStyle={{
            background: 'transparent',
            border: 'none',
          }}
          containerStyle={{ background: 'transparent' }}
          dropdownStyle={{
            background: 'black',
            color: 'white',
            zIndex: '15',
          }}
        />
        <div className={styles['event-details__part-line']}></div>
        {errors.phone && !formData.phone && (
          <p className={styles['event-details__part-error']}>{errors.phone}</p>
        )}
        <input
          value={formData.email}
          onChange={handleChange}
          className={styles['event-details__part-input']}
          type="email"
          name="email"
          placeholder="Email address"
        />
        <div className={styles['event-details__part-line']}></div>
        {errors.email && !formData.email && (
          <p className={styles['event-details__part-error']}>{errors.email}</p>
        )}
      </form>
      {successMessage && (
        <p className={styles['event-details__success']}>
          Data sent successfully!
        </p>
      )}
      {errorMessage && (
        <p className={styles['event-details__error']}>
          Data sent failed. Please try again.
        </p>
      )}
      <div className={styles['event-details__part-buttons']}>
        <button
          type="submit"
          className={styles['event-details__part-send']}
          onClick={isAuthenticated ? handleSubmitAuth : handleSubmit}
        >
          {isSubmitting ? 'Sending' : 'Send'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className={styles['event-details__part-cancel']}
        >
          Cancel
        </button>
      </div>
    </>
  );
};
