import React, { ReactElement } from "react";

type Props = {
  children: ReactElement;
};

const Container = (props: Props) => {
  return (
    <section
      className="px-4 py-10 sm:py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-8 lg:py-20 "
      data-aos="fade-up"
    >
      {props.children}
    </section>
  );
};

export default Container;
