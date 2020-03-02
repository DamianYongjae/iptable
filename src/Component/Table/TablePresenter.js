import React from "react";
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
import "../../Styles/modalStyle.css";

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

var result = "";

const rows = [];

const data = [];

const TablePresenter = ({
  classes,
  //   rows,
  //   data,
  //   input,
  columns,
  createData,
  getTime,
  validateIPAddress,
  useStyles
  //   onKeyPress
}) => {
  //   const classes = useStyles();
  //   var Modal = ReactBootstrap.Modal;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [show, setShow] = React.useState(false);
  const target = React.useRef(null);

  function handleShowOverlay(ip = 0) {
    // answer = getIpInfoByHover(ip);
    const answer = {
      ip: "173.67.12.12",
      country_name: "United States",
      state_prov: "VA",
      city: "Baltimore",
      isp: "Verizon Communications"
    };

    result =
      "ip: " +
      ip +
      "\n" +
      " country_name: " +
      answer["country_name"] +
      "\n" +
      " state: " +
      answer["state_prov"] +
      "\n" +
      " city: " +
      answer["city"] +
      "\n" +
      " isp: " +
      answer["isp"];
    console.log(ip);
    setShow(!show);
  }

  var IPGeolocationAPI = require("ip-geolocation-api-javascript-sdk");

  var ipgeolocationApi = new IPGeolocationAPI(
    "1d255992d5c340bb9f757bcc3c7708db",
    false
  );
  function handleResponse(json) {
    console.log(json);
  }

  const getIpInfoByHover = ip => {
    var GeolocationParams = require("ip-geolocation-api-javascript-sdk/GeolocationParams.js");

    var geolocationParams = new GeolocationParams();
    geolocationParams.setIPAddress("173.67.12.12");
    geolocationParams.setLang("en");
    geolocationParams.setFields("country_name,state_prov,city,isp");

    return ipgeolocationApi.getGeolocation(handleResponse, geolocationParams);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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

  return (
    <>
      <Overlay target={target.current} show={show} placement="right">
        {props => (
          <Tooltip
            id="overlay-example"
            style={{ width: "180px", height: "300px" }}
            {...props}
          >
            <p>
              {result.split("\n").map((i, key) => {
                return <div key={key}>{i}</div>;
              })}
            </p>
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
        <CSVLink data={data} filename={"list.csv"} enclosingCharacter={","}>
          <Button text={"export"}></Button>
        </CSVLink>

        <Button text={"import"} />

        <Container fixed>
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
                            onMouseEnter={() => {
                              handleShowOverlay(row["ipAddr"]);

                              //   console.log(row["ipAddr"]);
                              //   getIpInfoByHover(row["ipAddr"]);
                            }}
                            onMouseLeave={() => {
                              handleShowOverlay();
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
