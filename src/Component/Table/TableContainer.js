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
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  }
});

const TableContainer = () => {
  const classes = useStyles();

  const rows = [];

  const exportData = [];

  var rowBlack = [];
  var rowWhite = [];

  const columns = [
    { id: "ipAddr", label: "IP ADDRESS", minWidth: 170 },
    { id: "inputDate", label: "Date Added", minWidth: 100 },
    {
      id: "memo",
      label: "Memo",
      minWidth: 170
    }
  ];

  const [table, setTable] = React.useState([]);

  var IPGeolocationAPI = require("ip-geolocation-api-javascript-sdk");

  var ipgeolocationApi = new IPGeolocationAPI(
    "1d255992d5c340bb9f757bcc3c7708db",
    false
  );

  const separateTable = () => {
    rows.forEach(row => {
      if (row.isBlack) {
        rowBlack.push(row);
      } else {
        rowWhite.push(row);
      }
    });
  };

  useEffect(() => {
    axios.get(`http://localhost:3305`).then(res => {
      setTable(res.data);
    });
  }, []);

  async function getDataFromDB(table) {
    table.forEach(element => {
      var ip = element["ipAddr"];
      var date = element["inputDate"].slice(0, 10);
      var memo = element["memo"];
      var isBlack = element["isBlack"];
      if (!rows.includes(ip)) {
        var createdData = createData(ip, date, memo, isBlack);
        rows.push(createdData);
        exportData.push([ip]);
      }
    });
    separateTable();
  }

  getDataFromDB(table);

  function validateIPAddress(inputText) {
    var ipformat = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

    if (ipformat.test(inputText)) {
      return true;
    }
    return false;
  }

  function createData(ipAddr, inputDate, memo = "", isBlack = true) {
    return { ipAddr, inputDate, memo, isBlack };
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

  const buildFileSelector = () => {
    const fileSelector = document.createElement("input");
    fileSelector.setAttribute("type", "file");
    return fileSelector;
  };

  return (
    <TablePresenter
      answer={answer}
      classes={classes}
      columns={columns}
      rows={rows}
      exportData={exportData}
      rowBlack={rowBlack}
      rowWhite={rowWhite}
      ipgeolocationApi={ipgeolocationApi}
      createData={createData}
      getTime={getTime}
      validateIPAddress={validateIPAddress}
      includeIP={includeIP}
      getDataFromDB={getDataFromDB}
      separateTable={separateTable}
      buildFileSelector={buildFileSelector}
    />
  );
};

export default TableContainer;
