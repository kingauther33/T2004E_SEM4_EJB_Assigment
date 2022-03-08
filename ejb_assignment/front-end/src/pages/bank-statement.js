import React, { useEffect, useState } from "react";
import { DashboardLayout } from "src/components/dashboard-layout";
import NextLink from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import {
  Box,
  CardContent,
  Container,
  Grid,
  TextField,
  Button,
  CardHeader,
  Divider,
  Card,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Avatar,
  TablePagination,
  Typography,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Head from "next/head";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useUser } from "src/providers/user-context";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useAPI } from "src/hooks/useAPI";
import { format, parseISO } from "date-fns";
import axios from "axios";

const BankStatement = ({ ...rest }) => {
  const [logList, setLogList] = useState([]);
  const { userInfo } = useUser();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const { API } = useAPI();

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleCssColor = (log) => {
    if (log.type === "TRANSACTION" && log.receiverId == userInfo.id) {
      return "PLUS";
    }

    if (log.type === "TRANSACTION" && log.senderId == userInfo.id) {
      return "MINUS";
    }

    if (log.type === "LOAN") {
      return "PLUS";
    }
  };

  useEffect(() => {
    const fetchLogs = async () => {
      await axios
        .get(API.getLogs.url, API.config)
        .then((res) => {
          console.log(res);
          setLogList(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    API.config.headers.Authorization && fetchLogs();
  }, [API]);

  return (
    <>
      <Head>
        <title>Bank Statement</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Typography color="inherit" variant="h2">
            Bank Statement:
          </Typography>
          <Grid item xs={12}>
            <Card {...rest}>
              <PerfectScrollbar>
                <Box sx={{ minWidth: 1050 }}>
                  <Typography variant="subtitle1">Balance: {userInfo.balance} $</Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Created At</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {logList.slice(0, limit).map((log, idx) => (
                        <TableRow
                          // hover
                          key={log.id}
                          sx={
                            handleCssColor(log) === "MINUS"
                              ? {
                                  bgcolor: "indianred",
                                  ":hover": {
                                    bgcolor: "error.main",
                                  },
                                }
                              : {
                                  bgcolor: "lightgreen",
                                  ":hover": {
                                    bgcolor: "success.main",
                                  },
                                }
                          }
                          // sx={{ bgcolor: "red" }}
                        >
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>
                            {handleCssColor(log) === "MINUS" ? "-" : "+"}
                            {log.amount} $
                          </TableCell>
                          <TableCell>{log.type}</TableCell>
                          <TableCell>{format(parseISO(log.createdAt), "dd/MM/yyyy")}</TableCell>
                          {/* <TableCell>{log.createdAt}</TableCell> */}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </PerfectScrollbar>
              <TablePagination
                component="div"
                count={logList.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </Card>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

BankStatement.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default BankStatement;
