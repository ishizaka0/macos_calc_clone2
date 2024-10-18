"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { mdiAirConditioner, mdiNumeric0BoxMultipleOutline, mdiDivision } from '@mdi/js';
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
  wordWrap: 'break-word',
  userSelect: 'text',
  cursor: 'text',
  transition: 'background-color 0.3s ease',
});

const CopyButton = styled(Button)({
  color: '#fff',
  minWidth: 'auto',
  padding: '6px 8px',
  fontSize: '0.6rem',
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: '#555',
  },
});

const WindowControls = styled('div')({
  display: 'flex',
  alignItems: 'center',
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
    fontSize: '0.9rem',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
  },
  '&.dark-gray': {
    backgroundColor: '#555',
  },
  '&.light-gray': {
    backgroundColor: '#888',
  },
});

const Page = () => {
  const [displayValue, setDisplayValue] = useState('0');
  const [currentExpression, setCurrentExpression] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [lastOperator, setLastOperator] = useState('');
  const [copyEffect, setCopyEffect] = useState(false);

  const formatNumber = (num: string) => {
    const parts = num.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const evaluateExpression = (expr: string): number => {
    expr = expr.replace(/,/g, '');
    expr = expr.replace(/×/g, '*').replace(/÷/g, '/');

    // 演算子に応じた百分率の処理
    expr = expr.replace(/(\d+(?:\.\d+)?)([+\-*/])(\d+(?:\.\d+)?)%/g, (match, num1, operator, num2) => {
      let percentageValue;
      if (operator === '+' || operator === '-') {
        // 加算・減算の場合
        percentageValue = parseFloat(num1) * (parseFloat(num2) / 100);
        return `${num1}${operator}${percentageValue}`;
      } else if (operator === '*' || operator === '/') {
        // 乗算・除算の場合
        percentageValue = parseFloat(num2) / 100;
        return `${num1}${operator}${percentageValue}`;
      }
      return match; // その他の場合はそのまま
    });

    // スタンドアロンの百分率の処理
    expr = expr.replace(/(\d+(?:\.\d+)?)%/g, (match, num) => {
      return (parseFloat(num) / 100).toString();
    });

    const result = eval(expr);
    return result;
  };

  const handleButtonClick = (label: string) => {
    if (label === 'AC') {
      setDisplayValue('0');
      setCurrentExpression('');
      setLastOperator('');
    } else if (['+', '-', '×', '÷'].includes(label)) {
      if (lastOperator) {
        // 既に演算子が押されている場合、演算子を置き換える
        setCurrentExpression((prev) => prev.slice(0, -1) + label);
      } else {
        setCurrentExpression((prev) => prev + displayValue + label);
      }
      setLastOperator(label);
      setJustEvaluated(false);
    } else if (label === '=') {
      try {
        const expression = currentExpression + displayValue;
        const result = evaluateExpression(expression);
        const formattedResult = formatNumber(result.toString());
        setDisplayValue(formattedResult);
        setHistory((prev) => [...prev, `${formatNumber(expression)} = ${formattedResult}`]);
        setCurrentExpression('');
        setJustEvaluated(true);
        setLastOperator('');
      } catch {
        setDisplayValue('Error');
        setCurrentExpression('');
        setLastOperator('');
      }
    } else if (label === '±') {
      setDisplayValue((prev) => {
        if (prev === '0' || prev === '') {
          return prev;
        }
        const newValue = prev.startsWith('-') ? prev.slice(1) : '-' + prev;
        return newValue;
      });
    } else if (label === '%') {
      setDisplayValue((prev) => {
        if (prev.includes('%')) {
          return prev;
        }
        return prev + '%';
      });
    } else if (label === '000') {
      setDisplayValue((prev) => {
        const newValue = prev === '0' ? '000' : prev + '000';
        return newValue;
      });
    } else if (label === 'delete') {
      setDisplayValue((prev) => {
        if (prev.length <= 1) {
          return '0';
        }
        return prev.slice(0, -1);
      });
    } else {
      setDisplayValue((prev) => {
        if (justEvaluated) {
          setJustEvaluated(false);
          return label;
        } else if (prev === '0' || lastOperator) {
          setLastOperator('');
          return label;
        } else {
          const newValue = prev + label;
          return newValue;
        }
      });
    }
  };

  const renderIcon = (label: string) => {
    switch (label) {
      case 'AC':
        return <Icon path={mdiAirConditioner} size={0.8} />;
      case '±':
        return '±';
      case '%':
        return <PercentIcon />;
      case '÷':
        return <Icon path={mdiDivision} size={0.8} />;
      case '×':
        return <CloseIcon />;
      case '-':
        return <RemoveIcon />;
      case '+':
        return <AddIcon />;
      case '=':
        return <DragHandleIcon />;
      case '000':
        return <Icon path={mdiNumeric0BoxMultipleOutline} size={0.8} />;
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

  const copyToClipboard = useCallback(() => {
    console.log('copyToClipboard関数が呼び出されました');
    navigator.clipboard.writeText(displayValue)
      .then(() => {
        console.log('コピーに成功しました');
        setCopyEffect(true);
        setTimeout(() => setCopyEffect(false), 300); // 300ms後にエフェクトを解除
      })
      .catch((err) => {
        console.error('コピーに失敗しました: ', err);
      });
  }, [displayValue]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      let label = '';

      if (/\d/.test(key)) {
        label = key;
      } else if (key === '+') {
        label = '+';
      } else if (key === '-') {
        label = '-';
      } else if (key === '*') {
        label = '×';
      } else if (key === '/') {
        label = '÷';
      } else if (key === 'Enter' || key === '=') {
        label = '=';
        event.preventDefault();
      } else if (key === '.') {
        label = '.';
      } else if (key === '%') {
        label = '%';
      } else if (key === 'Backspace' || key === 'Delete') {
        label = 'delete';
      } else if (key.toLowerCase() === 'c' || key === 'Escape') {
        label = 'AC';
      } else if (key === '±') {
        label = '±';
      } else {
        return;
      }

      handleButtonClick(label);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleButtonClick]);

  useEffect(() => {
    const handlePasteEvent = (event: ClipboardEvent) => {
      handlePaste(event);
    };

    window.addEventListener('paste', handlePasteEvent);

    return () => {
      window.removeEventListener('paste', handlePasteEvent);
    };
  }, []);

  const handlePaste = (event: ClipboardEvent | React.ClipboardEvent<HTMLSpanElement>) => {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    if (!clipboardData) return;
    const pastedText = clipboardData.getData('Text');
    const sanitizedInput = pastedText.replace(/[^\d.]/g, '');

    if (sanitizedInput) {
      setDisplayValue(sanitizedInput);
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
        <CopyButton
          onClick={copyToClipboard}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: '#888',
            borderRadius: '5px',
            width: '40px',
            height: '20px',
            color: '#fff',
            fontSize: '0.6rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          COPY
        </CopyButton>
        <Display
          onPaste={handlePaste as unknown as React.ClipboardEventHandler<HTMLSpanElement>}
          style={{
            backgroundColor: copyEffect ? '#666' : '#444', // コピー時に背景色を変更
          }}
        >
          {formatNumber(displayValue)}
        </Display>
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
                className={`${['÷', '×', '-', '+', '='].includes(label) ? 'operator' : ''} ${
                  ['AC', '±', '%'].includes(label) ? 'dark-gray' : ''
                } ${
                  ['0', '000', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].includes(label)
                    ? 'light-gray'
                    : ''
                }`}
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
