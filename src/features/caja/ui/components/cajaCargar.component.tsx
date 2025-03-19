//import { Form, Field } from 'react-final-form';
import { useState } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';


export default function CajasCargando({}: any) {
    const [countries, setCountries] = useState([]);

    return <div className="w-[95%] h-[150px] mt-5 flex flex-col items-center bg-white p-5 rounded-xl">
        <div className="w-[60%] h-full">
            {/*
            <Form onSubmit={onSubmit} initialValues={{ name: '', email: '', password: '', date: null, country: null, accept: false }} validate={validate} render={({ handleSubmit }) => (
                <form>
                    <Field name="date" render={({ input }) => (
                        <div className="field">
                            <span className="p-float-label">
                                <Calendar id="date" {...input} dateFormat="dd/mm/yy" mask="99/99/9999" showIcon />
                                <label htmlFor="date">Birthday</label>
                            </span>
                        </div>
                    )} />
                    <Field name="country" render={({ input }) => (
                        <div className="field">
                            <span className="p-float-label">
                                <Dropdown id="country" {...input} options={countries} optionLabel="name" />
                                <label htmlFor="country">Country</label>
                            </span>
                        </div>
                    )} />
                    <Button type="submit" label="Submit" className="mt-2" />
                </form>
            )} />
             */}
        </div>
        <div className="w-[40%] h-full"></div>
    </div>
}