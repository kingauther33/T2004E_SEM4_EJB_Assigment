import React from "react";
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
  Typography
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Head from "next/head";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useUser } from "src/providers/user-context";
import { PerfectScrollbar } from "react-perfect-scrollbar";

const Transaction = ({...rest}) => {
  const { userInfo } = useUser();

  const formik = useFormik({
    initialValues: {
      beneficiaryName: "",
      amount: "",
    },
    validationSchema: Yup.object({
      beneficiaryName: Yup.string()
        .min(4, "Benefiacry Name must have at least 4 characters")
        .max(255)
        .required("Beneficiary name is required"),
      amount: Yup.number("Must be number")
        .min(1, "Amount must be greater than 1")
        .max(50000, "Amount must be smaller than 50000")
        .required("Amount is required"),
    }),
    onSubmit: (values, helperFunc) => {},
  });

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
          <Card>
            <CardHeader subheader="Transfer to another account" title="Transfer" />

            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(formik.touched.beneficiaryName && formik.errors.beneficiaryName)}
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

          <Card {...rest}>
            <PerfectScrollbar>
              <Box sx={{ minWidth: 1050 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Registration date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customers.slice(0, limit).map((customer) => (
                      <TableRow
                        hover
                        key={customer.id}
                        selected={selectedCustomerIds.indexOf(customer.id) !== -1}
                      >
                        <TableCell>
                          <Box
                            sx={{
                              alignItems: "center",
                              display: "flex",
                            }}
                          >
                            <Avatar src={customer.avatarUrl} sx={{ mr: 2 }}>
                              {getInitials(customer.name)}
                            </Avatar>
                            <Typography color="textPrimary" variant="body1">
                              {customer.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>
                          {`${customer.address.city}, ${customer.address.state}, ${customer.address.country}`}
                        </TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>{format(customer.createdAt, "dd/MM/yyyy")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </PerfectScrollbar>
            <TablePagination
              component="div"
              count={customers.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              page={page}
              rowsPerPage={limit}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Transaction;

Transaction.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
