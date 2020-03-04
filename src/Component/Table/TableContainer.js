import React, { useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import TablePresenter from "./TablePresenter";

var answer = { ip: "", country_name: "", state_prov: "", city: "", isp: "" };

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

  const exportData = [];

  const [table, setTable] = React.useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3305`).then(res => {
      setTable(res.data);
    });
  }, []);

  async function getDataFromDB(table) {
    table.forEach(element => {
      var ip = element["ipAddr"];
      var date = element["inputDate"].slice(0, 10);
      if (!rows.includes(ip)) {
        var createdData = createData(ip, date);
        rows.push(createdData);
        exportData.push([ip]);
      }
    });
  }

  getDataFromDB(table);

  function validateIPAddress(inputText) {
    var ipformat = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

    if (ipformat.test(inputText)) {
      return true;
    }
    return false;
  }

  const columns = [
    { id: "ipAddr", label: "IP ADDRESS", minWidth: 70 },
    { id: "inputDate", label: "Date Added", minWidth: 70 },
    { id: "memo", label: "Memo", minWidth: 100 }
  ];

  function createData(ipAddr, inputDate) {
    return { ipAddr, inputDate };
  }

  function getTime() {
    var tempDate = new Date();
    var month = tempDate.getMonth() + 1;
    var day = tempDate.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }

    var date = tempDate.getFullYear() + "-" + month + "-" + day;
    return date;
  }

  function includeIP(array, ip) {
    var answer = false;
    array.forEach(element => {
      if (element[0] === ip) {
        answer = true;
      }
    });
    return answer;
  }

  return (
    <TablePresenter
      answer={answer}
      classes={classes}
      rows={rows}
      exportData={exportData}
      useStyles={useStyles}
      columns={columns}
      createData={createData}
      getTime={getTime}
      validateIPAddress={validateIPAddress}
      includeIP={includeIP}
    />
  );
};

export default TableContainer;
