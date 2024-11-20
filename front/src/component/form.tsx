import { useState, useEffect } from 'react';
import { getApi, postApi } from '../utils/GlobalApi';
import Swal from 'sweetalert2';

const InvoiceForm = () => {
    const [products, setProducts] = useState<any>([]);
    const [invoiceDetails, setInvoiceDetails] = useState<any>([]);
    const [customerName, setCustomerName] = useState<any>('');
    const [isUpdateMode, setIsUpdateMode] = useState<boolean>(false);

    const [selectedProduct, setSelectedProduct] = useState<any>({
        Product_Id: '',
        Rate: 0,
        Unit: '',
        Qty: 0,
        Disc_Percentage: 0,
        NetAmount: 0,
        TotalAmount: 0,
    });

    useEffect(() => {
        const fetchProducts = async () => {
            getApi('products').then((res: any) => {
                setProducts(res);
            });
        };
        fetchProducts();

        // Load invoice details & Customer Name from local storage
        const storedInvoiceDetails = localStorage.getItem('invoiceDetails');
        const storedCustomerName = localStorage.getItem('customer_name');
        if (storedInvoiceDetails) {
            setInvoiceDetails(JSON.parse(storedInvoiceDetails));
            setCustomerName(storedCustomerName);
        }
    }, []);

    useEffect(() => {
        // Save invoice details to local storage whenever they change
        localStorage.setItem('invoiceDetails', JSON.stringify(invoiceDetails));
    }, [invoiceDetails]);

    const handleProductChange = (e: any) => {
        const product = products.find((p: any) => p._id === e.target.value);

        if (product) {
            setSelectedProduct({
                ...selectedProduct,
                Product_Id: product._id,
                Rate: product.rate,
                Unit: product.unit,
                NetAmount: 0,
                TotalAmount: 0,
            });
        }
    };

    const handleQtyChange = (e: any) => {
        const qty = e.target.value;
        const netAmount = selectedProduct.Rate - (selectedProduct.Disc_Percentage / 100 * selectedProduct.Rate);
        const totalAmount = netAmount * qty;
        setSelectedProduct({
            ...selectedProduct,
            Qty: parseInt(qty),
            NetAmount: netAmount,
            TotalAmount: totalAmount,
        });
    };

    const handleDiscChange = (e: any) => {
        const discPercentage = e.target.value;
        const netAmount = selectedProduct.Rate - (discPercentage / 100 * selectedProduct.Rate);
        const totalAmount = netAmount * selectedProduct.Qty;
        setSelectedProduct({
            ...selectedProduct,
            Disc_Percentage: parseInt(discPercentage),
            NetAmount: netAmount,
            TotalAmount: totalAmount,
        });
    };

    const addInvoiceDetail = () => {
        if (selectedProduct.Product_Id) {
            setInvoiceDetails([...invoiceDetails, selectedProduct]);
            localStorage.setItem('customer_name', customerName);
            resetSelectedProduct();
        } else {
            alert("Please select a product.");
        }
    };

    const resetSelectedProduct = () => {
        setSelectedProduct({
            Product_Id: '',
            Rate: 0,
            Unit: '',
            Qty: 0,
            Disc_Percentage: 0,
            NetAmount: 0,
            TotalAmount: 0,
        });
    };

    const handleUpdateDetail = () => {
        if (selectedProduct.Product_Id) {
            const updatedDetails = invoiceDetails.map((detail: any, index: any) => {
                if (index === invoiceDetails.findIndex((d: any) => d.Product_Id === selectedProduct.Product_Id)) {
                    return { ...selectedProduct, CustomerName: customerName };
                }
                return detail;
            });

            setInvoiceDetails(updatedDetails);
            resetSelectedProduct();
            // setCustomerName('');
            setIsUpdateMode(false);
        } else {
            alert("Please select a product.");
        }
    };

    const handleInvoicePatchValue = (index: number) => {
        const patchFormValue = invoiceDetails[index];

        if (patchFormValue) {
            // Set the selected product with the details
            setSelectedProduct({
                Product_Id: patchFormValue.Product_Id,
                Rate: patchFormValue.Rate,
                Unit: patchFormValue.Unit,
                Qty: patchFormValue.Qty,
                Disc_Percentage: patchFormValue.Disc_Percentage,
                NetAmount: patchFormValue.NetAmount,
                TotalAmount: patchFormValue.TotalAmount,
            });

            // Set the update mode to true
            setIsUpdateMode(true);
        }
    }

    const handleRemoveDetail = (index: number) => {
        Swal.fire({
            icon: 'warning',
            title: 'Remove!',
            text: `Are you sure you want to delete ?`,
            showConfirmButton: true,
            showCancelButton: true
        }).then((res: any) => {
            if (res.value === true) {
                const updatedDetails = invoiceDetails.filter((_: any, i: number) => i !== index);
                setInvoiceDetails(updatedDetails);
            }
        })
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const invoiceData = {
            customerName,
            invoiceDetails,
        };
        postApi('invoices', invoiceData).then((res: any) => {
            console.log(res);
        })
        // Reset form after submission
        setCustomerName('');
        setInvoiceDetails([]);
        localStorage.clear();
    };

    return (
        <>
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="row">

                        <div className="col-md-3 col-sm-6 my-1">
                            <label>Customer Name:</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder='Enter Customer Name'
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3 col-sm-6 my-1">
                            <label>Product:</label>
                            <select className="form-control" onChange={handleProductChange} value={selectedProduct.Product_Id}>
                                <option value="">Select a product</option>
                                {products?.map((product: any) => (
                                    <option key={product._id} value={product._id}>{product.product_Name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3 col-sm-6 my-1">
                            <label>Rate:</label>
                            <input type="text" className="form-control" placeholder='Enter Rate' value={selectedProduct.Rate} readOnly />
                        </div>
                        <div className="col-md-3 col-sm-6 my-1">
                            <label>Unit:</label>
                            <input type="text" className="form-control" placeholder='Enter Unit' value={selectedProduct.Unit} readOnly />
                        </div>
                        <div className="col-md-3 col-sm-6 my-1">
                            <label>Qty:</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder='Enter Quantity'
                                value={selectedProduct.Qty}
                                onChange={handleQtyChange}
                            />
                        </div>
                        <div className="col-md-3 col-sm-6 my-1">
                            <label>Disc %:</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder='Enter Discount Percentage'
                                value={selectedProduct.Disc_Percentage}
                                onChange={handleDiscChange}
                            />
                        </div>
                    </div>
                    <div style={{ float: 'right' }}>
                        {isUpdateMode ? (
                            <button className='btn btn-primary' type="button" onClick={handleUpdateDetail}>Update</button>
                        ) : (
                            <button className='btn btn-primary' type="button" onClick={addInvoiceDetail}>Add</button>
                        )}
                    </div>

                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Rate</th>
                                <th>Unit</th>
                                <th>Qty</th>
                                <th>Disc %</th>
                                <th>Net Amount</th>
                                <th>Total Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoiceDetails.map((detail: any, index: number) => (
                                <tr key={index}>
                                    <td>{products?.find((p: any) => p._id === detail.Product_Id)?.product_Name}</td>
                                    <td>{detail.Rate}</td>
                                    <td>{detail.Unit}</td>
                                    <td>{detail.Qty}</td>
                                    <td>{detail.Disc_Percentage}</td>
                                    <td>{detail.NetAmount.toFixed(2)}</td>
                                    <td>{detail.TotalAmount.toFixed(2)}</td>
                                    <td>
                                        <button className='btn me-1 p-0' type="button" onClick={() => handleInvoicePatchValue(index)}>
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button className='btn p-0' type="button" onClick={() => handleRemoveDetail(index)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={{ float: 'right' }}>
                        <button className='btn btn-primary' type="submit">Submit Invoice</button>
                    </div>

                </form>
            </div>
        </>
    );
};

export default InvoiceForm;