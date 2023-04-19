import React, { useState } from 'react'
import styles from '@/styles/services.module.scss'
import PageUser from '@/components/PageUser'
import { NumberInput, Select, Textarea } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import axios from 'axios';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

function index({data}) {
  const { t } = useTranslation("services");
    const {locale ,query} = useRouter()
    const [value, setValue] = useState(new Date());
    const [valueSelect, setValueSelect] = useState(+query.id);
    const [message, setMessage] = useState("");
    const [urgency, setUrgency] = useState("low");
    const ArraySelect =[]
    data.map((item)=> ArraySelect.push({value: item.id, label: item.name[locale]}))
   
    const handellogin = () => {
      
    
        const po = axios
          .post(
            "https://admin.marina.com.eg/api/service/request",
            {
                service_id: valueSelect,
                message: message,
                available_date: value,
                urgency: urgency
            },
            {
              headers: {
                "Authorization": `Bearer ${Cookies.get("access_token")}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Accept-Language": `${locale}`,
              },
            }
          )
          .then((res) => {
            console.log(res);
          })
          .catch((error) => {
            console.log(error);
            alert(error);
          });
    
        console.log(po);
      };


  return (
    <div className={styles.services}>
        <PageUser>
        <div className={styles.addservices}>
<div className='container mx-auto'>
<div className={styles.addservices_flex}>


    <h2>{t("new")}</h2>
<form>
            <div>
              <div className="mt-2">
              <Select
  data={ArraySelect}
  value={valueSelect}
  onChange={setValueSelect}
  placeholder={t("type")}
  variant="unstyled"
  radius="xs"
/>
              </div>

              <div className="mt-2 ">
              <Select
  data={[
    { value: 'low', label: 'low' },
    { value: 'medium', label: 'medium' },
    { value: 'High', label: 'High' },
  ]}
  onChange={setUrgency}
  placeholder={t("urgency")}
  variant="unstyled"
  radius="xs"
/>
              </div>
              <div className="mt-2 ">
              <DatePickerInput
              clearable
      defaultValue={value}
      placeholder={t("date")}
     
      onChange={setValue}
      mx="auto"
      maw={"100%"}
    />
              </div>
              <div className="mt-2 ">
                <Textarea  placeholder={t("description")} onChange={(e)=>setMessage(e.target.value)} radius="xs" hideControls />
              </div>
            </div>

            <button type="submit" className={styles.btn} onClick={(e)=>{e.preventDefault() , handellogin()}}>
          {t("sub")}
            </button>
          </form>
          </div>
    </div>


</div>

           
        </PageUser>
    </div>
  )
}

export default index



export async function getServerSideProps({locale}) {

    const res = await fetch(
      `https://admin.marina.com.eg/api/data/services`
    );
    const data = await res.json();
    return {
      props: {
        data,
        ...(await serverSideTranslations(locale, ["services", "common"])),
    
      },
    };
  }