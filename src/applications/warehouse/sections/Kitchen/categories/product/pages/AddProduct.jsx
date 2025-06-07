import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addProducts, eidtProduct } from '../../../../../../../apis/product';


import { getSubCategoryById } from '../../../../../../../apis/subCategory';
import DynamicForm from '../../../../../../../components/shared/form/Form';

const AddProduct = () => {
    const navigate = useNavigate();

    const { id } = useParams()

    const handleSubmit = async (formData) => {
        console.log(formData);
        await addProducts(formData.name, formData.description, formData.price, formData.image, category_id, id);
        await navigate(`/warehouse/returants/subcategory/show-product/${id}`);
    };

    const [categories, setCategories] = useState([]); // Initialize categories state
    const [units, setUnits] = useState([]); // Initialize categories state

    const [data, setData] = useState('')
    const [category_id, setCategoryId] = useState('')


    useEffect(() => {
        const fetchData = async () => {
            try {
                const recipeData = await getSubCategoryById(id);
                setData(recipeData.data.name);
                setCategoryId(recipeData.data.category.id);
                console.log(recipeData.data.category.id)

                console.log(recipeData.data.name)
            } catch (error) {
                console.log("Error fetching data:", error);
            }
        };

        fetchData(); // Call fetchData when component mounts
    }, []);


    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const unitData = await getUnits();
    //             setUnits(unitData.data);
    //         } catch (error) {
    //             console.log("Error fetching data:", error);
    //         }
    //     };

    //     fetchData(); // Call fetchData when component mounts
    // }, []);

    const fields = [
        { type: 'text', name: 'parent', placeholder: `${data}`, required: false, disabled: true },
        { type: 'text', name: 'name', labelName: "الاسم", placeholder: 'يجب عليك ادخال الاسم', required: true },

        // { type: 'number', name: 'quantity', placeholder: 'يجب عليك ادخال الكميه', required: true },
        { type: 'number', name: 'price', labelName: "السعر", placeholder: 'يجب عليك ادخال السعر', required: true },
        { type: 'text', name: 'description', labelName: "الوصف", placeholder: 'يجب عليك ادخال الوصف', required: true },
        // { type: 'number', name: 'day_before_expire', placeholder: 'يجب عليك ادخال تاريح الصلاحيه', required: true },


        // {
        //     type: 'select',
        //     name: 'unit_id',
        //     placeholder: 'اختر  الكميه',
        //     options: units.map(units => ({ value: units.id, label: units.name }))
        // },



        { type: 'image', name: 'image', placeholder: 'يجب عليك ادخال الصوره' },


    ];

    return (
        <div className='form-container'>
            <h1 className='form-title'>ادخال منتج جديد</h1>
            <DynamicForm fields={fields} onSubmit={handleSubmit} />
        </div>
    );
};

export default AddProduct;
