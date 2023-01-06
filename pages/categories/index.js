import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Grid, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import styles from './Categories.module.scss';
import FullScreenLoader from '../../components/FullScreenLoader';
import axios from 'axios';

const columns = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'name', headerName: 'Category', width: 320 },
  { field: 'description', headerName: 'Description', width: 560 }
];

export default function Categories(props) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const getAllCategories = async () => {
      const response = await axios.get(`/api/categories`);
      setCategories(response.data.data);
      setIsLoading(false);
    };

    getAllCategories();
  }, []);

  return (
    <>
      <Head>
        <title>Categories</title>
      </Head>
      <Header></Header>
      <main className={classNames(styles.main)}>
        <Sidebar></Sidebar>
        <FullScreenLoader open={isLoading}></FullScreenLoader>
        <Grid className={classNames(styles.content)}>
          <DataGrid
            rows={categories}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
          />
        </Grid>
      </main>
      <Footer sx={{ background: '#808080' }}></Footer>
    </>
  );
}
