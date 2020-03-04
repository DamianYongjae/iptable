import React from "react";
import axios from "axios";
import styled from "styled-components";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from "@material-ui/core";
import Button from "../Buttons";
import Input from "../Input";
import useInput from "../../Hooks/useInput";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv";
import { Tooltip, Overlay } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Style/tooltip.css";
import "../Style/table.css";
import Axios from "axios";

const Wrapper = styled.div`
  width: 100%;
  margin-top: 30px;
  align-items: center;
  text-align: center;
  justify-content: center;
  justify: flex;
`;

const Header = styled(TableHead)`
  background-color: #c7c7cf;
  text-align: center;
`;

const Row = styled(TableRow)`
  text-align: center;
`;

const TooltipButton = styled(Button)`
  padding: 0;
  width: 20px;
  height: 20px;
  background-color: #c7c7cf;
  color: black;
`;

var result = "";

var answer = { ip: "", country_name: "", state_prov: "", city: "", isp: "" };

const TablePresenter = ({
  classes,
  rows,
  exportData,
  columns,
  createData,
  getTime,
  validateIPAddress,
  useStyles,
  includeIP
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [show, setShow] = React.useState(false);
  const target = React.useRef(null);

  function closeOverlay() {
    setShow(false);
  }

  function handleShowOverlay(ip) {
    result =
      "IP: " +
      ip +
      "\n" +
      " Country: " +
      answer["country_name"] +
      "\n" +
      " State: " +
      answer["state_prov"] +
      "\n" +
      " City: " +
      answer["city"] +
      "\n" +
      " ISP: " +
      answer["isp"];
    setShow(true);
  }

  var IPGeolocationAPI = require("ip-geolocation-api-javascript-sdk");

  var ipgeolocationApi = new IPGeolocationAPI(
    "1d255992d5c340bb9f757bcc3c7708db",
    false
  );
  function handleResponse(json) {
    answer = json;
    handleShowOverlay(answer["ip"]);
  }

  const getIpInfoByClick = ip => {
    var GeolocationParams = require("ip-geolocation-api-javascript-sdk/GeolocationParams.js");

    var geolocationParams = new GeolocationParams();
    geolocationParams.setIPAddress(ip);
    geolocationParams.setLang("en");
    geolocationParams.setFields("country_name,state_prov,city,isp");

    ipgeolocationApi.getGeolocation(handleResponse, geolocationParams);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const input = useInput("");
  var createdData;

  const handleSubmit = event => {
    console.log("inside handleSubmit");

    var data = createdData;
    console.log(data);

    axios.post(`http://localhost:3305`, data).then(res => {
      console.log(res);
      console.log(res.data);
    });
  };

  const onKeyPress = async event => {
    const { which } = event;
    if (which === 13) {
      event.preventDefault();
      try {
        if (validateIPAddress(input.value)) {
          if (!includeIP(exportData, input.value)) {
            exportData.push([input.value]);
            createdData = createData(input.value, getTime());
            rows.push(createdData);
            console.log(exportData);

            toast.info("enter pressed. INPUT VALUE: " + input.value);
          } else {
            toast.error("duplicated ip address");
          }
        } else {
          toast.error("please input appropriate ip address format");
        }
        input.setValue("");
        handleSubmit();
      } catch {
        toast.error("error occurred");
      }
    }
  };

  return (
    <>
      <Overlay
        key={"key"}
        target={target.current}
        show={show}
        placement="right"
      >
        {props => (
          <Tooltip id="overlay-example" theme="light" {...props}>
            <div style={{ textAlign: "right" }}>
              <TooltipButton onClick={closeOverlay} text={"x"}></TooltipButton>
            </div>
            {result.split("\n").map((i, key) => {
              return (
                <div>
                  <div key={key}>{i}</div>
                </div>
              );
            })}
          </Tooltip>
        )}
      </Overlay>
      <Wrapper>
        <Input
          value={input.value}
          onChange={input.onChange}
          placeholder="ex) 192.168.1.1"
          onKeyPress={onKeyPress}
        />
        <CSVLink
          data={exportData}
          filename={"list.csv"}
          // enclosingCharacter={""}
        >
          <Button text={"export"}></Button>
        </CSVLink>

        <Button text={"import"} />

        <Container style={{ width: "60%" }}>
          <Paper className={classes.root}>
            <Wrapper>
              <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                  <Header>
                    <Row>
                      {columns.map(column => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </Row>
                  </Header>
                  <TableBody>
                    {rows
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map(row => {
                        return (
                          <Row
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.code}
                            onClick={() => {
                              getIpInfoByClick(row["ipAddr"]);
                            }}
                          >
                            {columns.map(column => {
                              const value = row[column.id];
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {column.format && typeof value === "number"
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                              );
                            })}
                          </Row>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </Wrapper>
          </Paper>
        </Container>
      </Wrapper>
    </>
  );
};

export default TablePresenter;
