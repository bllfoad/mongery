import React from 'react';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <Select
      value={i18n.language}
      onChange={handleLanguageChange}
      options={[
        { value: 'en', label: 'English' },
        { value: 'tr', label: 'Türkçe' },
      ]}
      style={{ width: 100 }}
    />
  );
};

export default LanguageSwitcher;
