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
import { API } from "src/api";
import { format } from "date-fns";
import axios from "axios";

const BankStatement = ({ ...rest }) => {
  const [logList, setLogList] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    const fetchLogs = async () => {
      await axios
        .get(API.getLogs.url, API.config)
        .then((res) => {
          console.log(res);
          debugger;
          setLogList(res.data);
        })
        .catch((err) => console.log(err));
    };

    fetchLogs();
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard | Material Kit</title>
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
            Bank Statement
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
                        <TableCell>Type</TableCell>
                        <TableCell>Created At</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {logList.slice(0, limit).map((log) => (
                        <TableRow
                          hover
                          key={log.id}
                          sx={{
                            bgColor: log.type === "",
                          }}
                        >
                          <TableCell>{log.id}</TableCell>
                          <TableCell>{log.amount} $</TableCell>
                          <TableCell>{log.type}</TableCell>
                          {/* <TableCell>{format(log.createdAt, "dd/MM/yyyy")}</TableCell> */}
                          <TableCell>{log.createdAt}</TableCell>
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
