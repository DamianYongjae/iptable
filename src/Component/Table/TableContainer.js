import React from "react";
import TablePresenter from "./TablePresenter";

const TableContainer = ({ id, ipAddr, inputDate, getTime }) => {
  return <TablePresenter id={id} ipAddr={ipAddr} inputDate={inputDate} />;
};

export default TableContainer;
