import React, { useEffect, useState } from 'react';
import styles from './DonationStepTwo.module.scss';

type Props = {
  onNext: () => void;
  onBack: () => void;
};

export const DonationStepTwo: React.FC<Props> = ({ onNext, onBack }) => {
  const [name, setName] = useState(localStorage.getItem('name') || '');
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [country, setCountry] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '' });

  useEffect(() => {
    localStorage.setItem('name', name);
  }, [name]);

  useEffect(() => {
    localStorage.setItem('email', email);
  }, [email]);

  const handleNextClick = () => {
    const newErrors = { name: '', email: '' };

    if (!name.trim()) {
      newErrors.name = 'Please enter your full name.';
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    setErrors(newErrors);

    if (!newErrors.name && !newErrors.email) {
      onNext();
    }
  };

  return (
    <div className={styles['donation-two']}>
      <p className={styles['donation-two__title']}>
        Enter your full name and email for the donation
      </p>
      <div className={styles['donation-two__content-bottom']}>
        <div className={styles['donation-two__input-block']}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className={styles['donation-two__input']}
            placeholder="Your full name"
          />
        </div>
        <div className={styles['donation-two__line']}></div>
        {errors.name && !name && (
          <p className={styles['donation-two__error']}>{errors.name}</p>
        )}
        <div className={styles['donation-two__input-block']}>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={styles['donation-two__input']}
            placeholder="Email address"
          />
        </div>
        <div className={styles['donation-two__line']}></div>
        {errors.email && (
          <p className={styles['donation-two__error']}>{errors.email}</p>
        )}
        <div className={styles['donation-two__input-block']}>
          <input
            value={country}
            onChange={e => setCountry(e.target.value)}
            className={styles['donation-two__input']}
            placeholder="Your country"
          />
        </div>
        <div className={styles['donation-two__line']}></div>
        <div className={styles['donation-two__main-buttons']}>
          <button
            type="button"
            className={styles['donation-two__button-next']}
            onClick={handleNextClick}
          >
            Next
          </button>
          <button
            type="button"
            className={styles['donation-two__button-back']}
            onClick={onBack}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};
