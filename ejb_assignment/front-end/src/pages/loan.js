import React, { useEffect, useState, useCallback } from "react";
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
import { PerfectScrollbar } from "react-perfect-scrollbar";
import { useAPI } from "src/hooks/useAPI";
import axios from "axios";

const Loan = ({ ...rest }) => {
  const { userInfo, setUserInfo } = useUser();
  const { API } = useAPI();
  const [isLoading, setIsLoading] = useState(true);
  const [loanState, setLoanState] = useState(0);
  const [loanData, setLoanData] = useState(null);
  // 0: NOT FOUND (404); 1: tìm thấy nhưng chưa approve (400); 2: tìm thấy và được approve (200)

  const fetchLoan = useCallback(async () => {
    await axios
      .get(API.checkApproveLoan.url, API.config)
      .then((res) => {
        console.log(res);
        setIsLoading(false);
        setLoanState(2);
      })
      .catch((error) => {
        setIsLoading(false);
        if (error.response.status === 400) {
          console.log(error.response.data);
          setLoanState(1);
        }
        console.log(error);
      });
  }, [API.checkApproveLoan.url, API.config]);

  const formik = useFormik({
    initialValues: {
      amount: "",
      tenure: "",
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .typeError("Must be number")
        .min(1, "Amount must be greater than 1")
        .max(50000, "Amount must be smaller than 50000")
        .required("Amount is required"),
      tenure: Yup.number()
        .typeError("Must be number")
        .min(1, "Amount must be greater than 1")
        .max(50000, "Amount must be smaller than 50000")
        .required("Amount is required"),
    }),
    onSubmit: async (values, helperFunc) => {
      const formData = {
        amount: values.amount,
        message: values.tenure,
      };

      await axios
        .post(API.createLoan.url, formData, API.config)
        .then((res) => {
          // update userInfo khi ckhoan thanh cong
          console.log(res);

          helperFunc.setSubmitting(false);
        })
        .catch((err) => {
          alert("Error happened, please try again later");
          console.error(err);
          helperFunc.setSubmitting(false);
        });
    },
  });

  useEffect(() => {
    console.log(API.checkApproveLoan.url);

    API.config.headers.Authorization && fetchLoan();
  }, [API, fetchLoan]);

  return (
    <>
      <Head>
        <title>Loan</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          {isLoading ? (
            "Loading ..."
          ) : loanState === 0 ? (
            <form onSubmit={formik.handleSubmit}>
              <Card>
                <CardHeader subheader="Request to get loan" title="Loan request" />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">Current rate: 5%</Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        sx={{ margin: 0 }}
                        error={Boolean(formik.touched.amount && formik.errors.amount)}
                        fullWidth
                        helperText={formik.touched.amount && formik.errors.amount}
                        label="Amount"
                        margin="normal"
                        name="amount"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="amount"
                        value={formik.values.amount}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        sx={{ margin: 0 }}
                        error={Boolean(formik.touched.tenure && formik.errors.tenure)}
                        fullWidth
                        helperText={formik.touched.tenure && formik.errors.tenure}
                        label="Tenure"
                        margin="normal"
                        name="tenure"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="tenure"
                        value={formik.values.tenure}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={9} />
                    <Grid item md={3}>
                      <Button
                        color="primary"
                        disabled={formik.isSubmitting}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                      >
                        Transfer
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </form>
          ) : loanState === 1 ? (
            <></>
          ) : (
            <></>
          )}
        </Container>
      </Box>
    </>
  );
};

export default Loan;

Loan.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
