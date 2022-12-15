import React from 'react';

const CustomToggle = React.forwardRef(
  ({ children, onClick }: any, ref: any) => (
    <div
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      <span className="three-dots"></span>
    </div>
  )
);

export default CustomToggle;
