import Table from "../../../../../components/shared/table/Table";
import "../../../../../components/shared/table/Table.scss";
import { deleteDeaprtment, getDeaprtments } from "../../../../../apis/department";
import { deleteUint, getUnits } from "../../../../../apis/unit";
const ShowUnits = () => {
    const tableHeaders = [

        { key: "name", value: " الاسم " },
        // { key: "image", value: "الصوره", type: "image" },


    ];
    // const filters = [
    //     { key: "name", type: "text", placeholder: "إبحث باللإسم", id: "الإسم" },

    // ];
    const actions = [
        {
            type: "edit",
            label: "تعديل",
            route: "/warehouse/units/:id/edit-units",
        },
        {
            type: "delete",
            label: "حذف",
        },


        {
            type: "add",
            label: "إضافة وحده ",
            route: "/warehouse/units/add-units",
        },
    ];

    return (
        <div>
            <Table
                headers={tableHeaders}
                title="الواحدات"


                fetchData={(filterValues, currentPage, setIsLoading) =>
                    getUnits(filterValues, currentPage, setIsLoading)
                }
                actions={actions}
                deleteFn={deleteUint}


            />
        </div>
    );
};

export default ShowUnits;
