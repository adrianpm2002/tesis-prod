import React from 'react';
import styled from 'styled-components';

const CultivoCard = ({ nombre, cantidadPlantas, tiempoCultivo, fechaCosecha }) => {
    return (
      <StyledWrapper>
        <div className="card">
          <p className="card__title">{nombre}</p>
          <div className="card__content">
            <p className="card__title">{nombre}</p>
            <p className="card__description">
              Cantidad de plantas: {cantidadPlantas}<br />
              Días de cultivo: {tiempoCultivo}<br />
              Fecha de Cosecha: {fechaCosecha}
            </p>
          </div>
        </div>
      </StyledWrapper>
    );
  };
const StyledWrapper = styled.div`
  .card {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0;
    cursor: pointer;
    background: linear-gradient(-45deg, #d69648c9 100%, #47b81a 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .card svg {
    width: 48px;
    fill: #f3eded;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .card:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  .card__content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    background-color: #fff;
    opacity: 0;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .card:hover .card__content {
    transform: translate(-50%, -50%) rotate(0deg);
    opacity: 1;
  }

  .card__title {
    margin: 0;
    font-size: 24px;
    color: #000000;
    font-weight: 700;
  }

  .card__description {
    margin: 10px 0 0;
    font-size: 18px;
    color: #777;
    line-height: 1.4;
  }

  .card:hover svg {
    scale: 0;
  }`;

export default Card;
