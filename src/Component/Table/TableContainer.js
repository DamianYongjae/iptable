import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { toast } from "react-toastify";
import useInput from "../../Hooks/useInput";
import TablePresenter from "./TablePresenter";

const useStyles = makeStyles({
  root: {
    width: "100%"
  },
  container: {
    maxHeight: "80%"
  },
  popover: {
    pointerEvents: "none"
  }
});

const TableContainer = () => {
  const classes = useStyles();

  const rows = [];

  const data = [];
  const input = useInput("");

  const onKeyPress = async event => {
    const { which } = event;
    if (which === 13) {
      event.preventDefault();
      try {
        if (validateIPAddress(input.value)) {
          rows.push(createData(input.value, getTime()));
          data.push([input.value]);
          toast.info("enter pressed. INPUT VALUE: " + input.value);
          input.setValue("");
        } else {
          toast.error("please input appropriate ip address format");
        }
      } catch {
        toast.error("error occurred");
      }
    }
  };

  const columns = [
    { id: "ipAddr", label: "IP ADDRESS", minWidth: 170 },
    { id: "inputDate", label: "Date Added", minWidth: 100 }
  ];

  function createData(ipAddr, inputDate) {
    return { ipAddr, inputDate };
  }

  function getTime() {
    var tempDate = new Date();
    var date =
      tempDate.getMonth() +
      1 +
      "/" +
      tempDate.getDate() +
      "/" +
      tempDate.getFullYear();
    return date;
  }

  function validateIPAddress(inputText) {
    var ipformat = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

    if (ipformat.test(inputText)) {
      return true;
    }
    return false;
  }

  return (
    <TablePresenter
      classes={classes}
      rows={rows}
      data={data}
      input={input}
      useStyles={useStyles}
      columns={columns}
      createData={createData}
      getTime={getTime}
      validateIPAddress={validateIPAddress}
      onKeyPress={onKeyPress}
    />
  );
};

export default TableContainer;
