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

const ApproveLoan = ({ ...rest }) => {
  const [logList, setLogList] = useState([]);
  const { userInfo } = useUser();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const { API } = useAPI();
  const [shouldReload, setShouldReload] = useState(false);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const checkStatus = (loan) => {
    console.log(loan);
    if (loan.status === "PROCESSING") {
      return "PROCESSING";
    }

    if (loan.status === "APPROVED") {
      return "APPROVED";
    }
  };

  const approveLoan = async (loan) => {
    await axios
      .post(API.approveLoan.url + loan.id, null, API.config)
      .then((res) => {
        setShouldReload((value) => !value);
      })
      .catch((err) => {
        alert("Error while approving loan, turn on back-end or try again later...");
        console.error(err);
      });
  };

  useEffect(() => {
    const fetchLogs = async () => {
      await axios
        .get(API.findAllLoan.url, API.config)
        .then((res) => {
          debugger;
          setLogList(res.data);
        })
        .catch((err) => {
          alert("Error happen while fetching data, turn on back-end or restart app");
          console.error(err);
        });
    };

    API.config.headers.Authorization && fetchLogs();
  }, [API, shouldReload]);

  return (
    <>
      <Head>
        <title>Approve</title>
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
            Approve Loan
          </Typography>
          <Grid item xs={12}>
            <Card {...rest}>
              <PerfectScrollbar>
                <Box sx={{ minWidth: 1050 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Rate</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Tenure</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Updated At</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {logList.slice(0, limit).map((loan, idx) => (
                        <TableRow
                          // hover
                          key={loan.id}
                          sx={
                            checkStatus(loan) === "PROCESSING"
                              ? {
                                  bgcolor: "#FCE883",
                                  ":hover": {
                                    bgcolor: "	#FFD300",
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
                          <TableCell>{loan.amount} $</TableCell>
                          <TableCell>{loan.rate}</TableCell>
                          <TableCell>{loan.status}</TableCell>
                          <TableCell>{loan.tenure}</TableCell>
                          <TableCell>{format(parseISO(loan.createdAt), "dd/MM/yyyy")}</TableCell>
                          <TableCell>{format(parseISO(loan.updatedAt), "dd/MM/yyyy")}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              disabled={checkStatus(loan) !== "PROCESSING"}
                              onClick={approveLoan.bind(null, loan)}
                            >
                              {checkStatus(loan) === "PROCESSING" ? "Approve" : "Approved"}
                            </Button>
                          </TableCell>
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

ApproveLoan.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ApproveLoan;
