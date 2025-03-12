import { useEffect, useState } from 'react';
import cn from 'classnames';
import styles from './DonationStepOne.module.scss';

type Props = {
  onNext: () => void;
  onCancel: () => void;
};

export const DonationStepOne: React.FC<Props> = ({ onNext, onCancel }) => {
  const [selectedAmount, setSelectedAmount] = useState(
    localStorage.getItem('donationAmount') || '',
  );
  const [customAmount, setCustomAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const storedAmount = localStorage.getItem('amount');

    if (storedAmount) {
      if (['10', '50', '100'].includes(storedAmount)) {
        setSelectedAmount(storedAmount);
      } else {
        setCustomAmount(storedAmount);
      }
    }
  }, []);

  const handleAmountClick = (amount: string) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    localStorage.setItem('amount', amount);
    setError('');
  };

  const handleCustomAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;

    setCustomAmount(value);
    setSelectedAmount('');
    localStorage.setItem('amount', value);
    setError('');
  };

  const handleNextClick = () => {
    if (!selectedAmount && !customAmount) {
      setError('Please select or enter a donation amount.');

      return;
    }

    onNext();
  };

  return (
    <div className={styles['donation-one']}>
      <p className={styles['donation-one__title']}>
        Please choose the amount of money you’d like to donate as well as the
        frequency of the donation
      </p>
      <div className={styles['donation-one__content-bottom']}>
        <div className={styles['donation-one__buttons']}>
          {['10', '50', '100'].map(amount => (
            <button
              key={amount}
              type="button"
              className={cn(styles['donation-one__button'], {
                [styles['donation-one__button--active']]:
                  selectedAmount === amount,
              })}
              onClick={() => handleAmountClick(amount)}
            >
              {amount}
            </button>
          ))}
          <button type="button" className={styles['donation-one__button']}>
            USD
          </button>
        </div>
        <div className={styles['donation-one__input-block']}>
          <input
            value={customAmount}
            onChange={handleCustomAmountChange}
            className={styles['donation-one__input']}
            placeholder="Enter customn donation sum"
          />
          <button type="button" className={styles['donation-one__button']}>
            USD
          </button>
        </div>
        <div className={styles['donation-one__line']}></div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles['donation-one__main-buttons']}>
          <button
            type="button"
            className={styles['donation-one__button-next']}
            onClick={handleNextClick}
          >
            Next
          </button>
          <button
            type="button"
            className={styles['donation-one__button-cancel']}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
