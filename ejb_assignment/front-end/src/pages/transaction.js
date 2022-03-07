import React, { useEffect } from "react";
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

const Transaction = ({ ...rest }) => {
  const { userInfo, setUserInfo } = useUser();
  const { API } = useAPI();

  const formik = useFormik({
    initialValues: {
      beneficiaryName: "",
      amount: "",
      message: "",
    },
    validationSchema: Yup.object({
      beneficiaryName: Yup.string()
        .min(4, "Benefiacry Name must have at least 4 characters")
        .max(255)
        .required("Beneficiary name is required"),
      amount: Yup.number()
        .typeError("Must be number")
        .min(1, "Amount must be greater than 1")
        .max(50000, "Amount must be smaller than 50000")
        .required("Amount is required"),
      message: Yup.string()
        .min(4, "Min 4 characters")
        .max(255, "Maximum 255 characters")
        .required("Message is reuiqred"),
    }),
    onSubmit: async (values, helperFunc) => {
      const formData = {
        beneficiaryName: values.beneficiaryName,
        amount: values.amount,
        message: values.message,
      };

      console.log(API.config.headers);

      await axios
        .post(API.createTracsaction.url, formData, API.config)
        .then((res) => {
          console.log(res);
          alert("Please go to Bank Statement to get values");
          // update userInfo khi ckhoan thanh cong
          const newBalance = (+userInfo.balance) - (+formData.amount);
          localStorage.setItem("balance", newBalance);
          setUserInfo((api) => ({ ...userInfo, balance: newBalance }));

          helperFunc.setSubmitting(false);
        })
        .catch((err) => {
          alert("Error happened, please try again later");
          console.error(err);
          helperFunc.setSubmitting(false);
        });
    },
  });

  return (
    <>
      <Head>
        <title>Transaction</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <form onSubmit={formik.handleSubmit}>
            <Card>
              <CardHeader subheader="Transfer to another account" title="Transfer" />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={Boolean(
                        formik.touched.beneficiaryName && formik.errors.beneficiaryName
                      )}
                      fullWidth
                      helperText={formik.touched.beneficiaryName && formik.errors.beneficiaryName}
                      label="Beneficiary Name"
                      margin="normal"
                      name="beneficiaryName"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type="beneficiaryName"
                      value={formik.values.beneficiaryName}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
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
                  <Grid item xs={12}>
                    <TextField
                      sx={{ margin: "0" }}
                      error={Boolean(formik.touched.message && formik.errors.message)}
                      fullWidth
                      helperText={formik.touched.message && formik.errors.message}
                      label="Message"
                      margin="normal"
                      name="message"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type="message"
                      value={formik.values.message}
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
        </Container>
      </Box>
    </>
  );
};

export default Transaction;

Transaction.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
