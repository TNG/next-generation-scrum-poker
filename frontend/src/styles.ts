export const BORDER_RADIUS = 'border-radius: 5px;';
export const TNG_BLUE = 'rgb(5,99,165)';
export const TNG_GRAY = 'rgb(161,166,174)';

export const headingStyle = `
    color: ${TNG_BLUE};
    font-size: 20px;
    text-align: center;
    line-height: 1.2;
`;

export const buttonStyle = `
    border: none;
    color: white;
    cursor: pointer;
    background: ${TNG_BLUE};
    ${BORDER_RADIUS};
    height: 50px;
    width: 150px;
    :hover {
      background: ${TNG_GRAY};
    }
`;

export const tableStyle = `
    text-align: left;
    padding: 15px;
    border-width: 3px;
    border-style: solid;
    border-color: ${TNG_BLUE};
    ${BORDER_RADIUS};
    margin: 10px;
  .header-row {
    color: ${TNG_BLUE};
    padding 25px;
  }
`;

export const tableHeaderStyle = `
    color: ${TNG_BLUE};
    padding 25px;
`;
