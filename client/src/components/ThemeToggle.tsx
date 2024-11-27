import React from 'react';
import { Button } from 'antd';
import { useTheme } from '../contexts/ThemeContext';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <Button
      type="text"
      icon={isDarkMode ? <BulbOutlined /> : <BulbFilled />}
      onClick={toggleTheme}
      title={t('theme.toggle')}
      aria-label={isDarkMode ? t('theme.switchToLight') : t('theme.switchToDark')}
    />
  );
};

export default ThemeToggle;
