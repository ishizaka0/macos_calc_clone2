"use client";

import React, { useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { mdiAirConditioner, mdiNumeric0BoxMultipleOutline, mdiFormatVerticalAlignCenter } from '@mdi/js';
import Icon from '@mdi/react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import PercentIcon from '@mui/icons-material/Percent';
import DragHandleIcon from '@mui/icons-material/DragHandle';

const CalculatorContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#000',
});

const Calculator = styled('div')({
  width: '240px',
  backgroundColor: '#333',
  borderRadius: '10px',
  padding: '10px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
  position: 'relative',
});

const Display = styled(Typography)({
  backgroundColor: '#444',
  color: '#fff',
  fontSize: '1.8rem',
  textAlign: 'right',
  padding: '10px',
  borderRadius: '5px',
  marginBottom: '10px',
});

const History = styled('div')({
  backgroundColor: '#222',
  color: '#fff',
  fontSize: '0.9rem',
  textAlign: 'left',
  padding: '10px',
  borderRadius: '5px',
  marginBottom: '10px',
  maxHeight: '150px',
  overflowY: 'auto',
});

const ButtonStyled = styled(Button)({
  color: '#fff',
  fontSize: '1.1rem',
  margin: '2px',
  minWidth: '50px',
  minHeight: '50px',
  '&:hover': {
    backgroundColor: '#fb3',
  },
  '&.operator': {
    backgroundColor: '#f90',
  },
  '&.zero': {
    flex: '2 0 46%',
  },
  '&.small': {
    fontSize: '0.9rem', // Smaller font size for specific buttons
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1rem', // Smaller icon size for non-numeric buttons
  },
  '&.dark-gray': {
    backgroundColor: '#555', // Dark gray for AC, ±, %
  },
  '&.light-gray': {
    backgroundColor: '#888', // Light gray for numbers
  },
});

const WindowControls = styled('div')({
  display: 'flex',
  gap: '8px',
  marginBottom: '10px',
});

const ControlButton = styled('div')(({ color }: { color: string }) => ({
  width: '12px',
  height: '12px',
  backgroundColor: color,
  borderRadius: '50%',
  cursor: 'pointer',
}));

const Page = () => {
  const [displayValue, setDisplayValue] = useState('0');
  const [history, setHistory] = useState<string[]>([]);

  const formatNumber = (num: string) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleButtonClick = (label: string) => {
    if (label === 'AC') {
      setDisplayValue('0');
    } else if (['+', '-', '×', '÷'].includes(label)) {
      setDisplayValue((prev) => prev + label);
    } else if (label === '=') {
      try {
        const expression = displayValue.replace(/,/g, '').replace('×', '*').replace('÷', '/');
        const result = eval(expression);
        setDisplayValue(formatNumber(result.toString()));
        setHistory((prev) => [...prev, `${displayValue} = ${formatNumber(result.toString())}`]);
      } catch {
        setDisplayValue('Error');
      }
    } else if (label === '±') {
      setDisplayValue((prev) => {
        if (prev === '0' || prev === '') {
          return prev; // 0や空の場合はそのまま
        }
        return prev.startsWith('-') ? prev.slice(1) : '-' + prev;
      });
    } else if (label === '%') {
      setDisplayValue((prev) => {
        const expression = prev.replace(/,/g, '').replace('×', '*').replace('÷', '/');
        const result = eval(expression) / 100;
        return formatNumber(result.toString());
      });
    } else if (label === '000') {
      setDisplayValue((prev) => (prev === '0' ? '000' : prev + '000'));
    } else {
      setDisplayValue((prev) => {
        const newValue = prev === '0' ? label : prev + label;
        return formatNumber(newValue.replace(/,/g, ''));
      });
    }
  };

  const renderIcon = (label: string) => {
    switch (label) {
      case 'AC':
        return <Icon path={mdiAirConditioner} size={0.8} />; // Smaller size
      case '±':
        return '±'; // No direct icon, using text
      case '%':
        return <PercentIcon />;
      case '÷':
        return <Icon path={mdiFormatVerticalAlignCenter} size={0.8} />; // Smaller size
      case '×':
        return <CloseIcon />;
      case '-':
        return <RemoveIcon />;
      case '+':
        return <AddIcon />;
      case '=':
        return <DragHandleIcon />;
      case '000':
        return <Icon path={mdiNumeric0BoxMultipleOutline} size={0.8} />; // Smaller size
      default:
        return label;
    }
  };

  const handleWindowControl = (action: string) => {
    switch (action) {
      case 'close':
        window.open('', '_self')?.close();
        break;
      case 'reload':
        window.location.reload();
        break;
      case 'fullscreen':
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.documentElement.requestFullscreen();
        }
        break;
      default:
        break;
    }
  };

  return (
    <CalculatorContainer>
      <Calculator>
        <WindowControls>
          <ControlButton color="#ff5f56" onClick={() => handleWindowControl('close')} />
          <ControlButton color="#ffbd2e" onClick={() => handleWindowControl('reload')} />
          <ControlButton color="#27c93f" onClick={() => handleWindowControl('fullscreen')} />
        </WindowControls>
        <Display>{displayValue}</Display>
        <History>
          {history.map((entry, index) => (
            <div key={index}>{entry}</div>
          ))}
        </History>
        <Grid container spacing={0}>
          {['AC', '±', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '000', '.', '='].map((label, index) => (
            <Grid item xs={label === '0' || label === '000' ? 3 : 3} key={index}>
              <ButtonStyled
                variant="contained"
                className={`${['÷', '×', '-', '+', '='].includes(label) ? 'operator' : ''} ${['AC', '±', '%'].includes(label) ? 'dark-gray' : ''} ${['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(label) ? 'light-gray' : ''}`}
                onClick={() => handleButtonClick(label)}
              >
                {renderIcon(label)}
              </ButtonStyled>
            </Grid>
          ))}
        </Grid>
      </Calculator>
    </CalculatorContainer>
  );
};

export default Page;
