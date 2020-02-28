import React from "react";
import PropTypes from "prop-types";
import TablePresenter from "./TablePresenter";
import { toast } from "react-toastify";

const TableContainer = ({ id, ipAddr, inputDate }) => {
  return <TablePresenter id={id} ipAddr={ipAddr} inputDate={inputDate} />;
};

export default TableContainer;
