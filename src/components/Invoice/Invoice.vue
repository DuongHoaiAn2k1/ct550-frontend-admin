<template>
    <div id="invoice">
        <h2>Hóa đơn</h2>
        <p class="text-muted p-0"><span class="fw-bold">Số:</span> #{{ billId }}</p>
        <p class="text-muted p-0"><span class="fw-bold">Tên khách hàng:</span> {{ customerName }}</p>
        <p class="text-muted p-0"><span class="fw-bold">Ngày đặt:</span> {{ date }}</p>
        <p class="text-muted p-0"><span class="fw-bold">Địa chỉ:</span> {{ formattedAddress }}</p>
        <table>
            <thead>
                <tr>
                    <th>STT</th>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Giá</th>
                    <th>Thành tiền</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in items.order_detail" :key="item.order_detail_id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.product.product_name }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ formatCurrency(item.total_cost_detail / item.quantity) }}</td>
                    <td>{{ formatCurrency(item.total_cost_detail) }}</td>
                </tr>
            </tbody>
        </table>
        <h6 class="mt-1 fw-bold">Phí vận chuyển : {{ formatCurrency(items.shipping_fee) }} đ</h6>
        <h5 class="fw-bold">Tổng thanh toán : {{ formatCurrency(items.total_cost) }} đ</h5>
        <button class="mt-1" @click="generateInvoice">Xuất hóa đơn PDF</button>
    </div>
</template>

<script setup>
import { defineProps, ref, computed, onMounted } from 'vue';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { formatCurrency } from '../../helpers/UtilHelper';

pdfMake.vfs = pdfFonts.pdfMake.vfs; // Register the fonts with pdfMake
pdfMake.fonts = {
    Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
    }
};

// Nhận props từ component cha
const props = defineProps({
    customerName: {
        type: String,
        required: true
    },
    billId: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    items: {
        type: Object,
        required: true
    }
});

// Biến lưu trữ địa chỉ
const address = ref({});

// Computed property cho địa chỉ
const formattedAddress = computed(() => {
    if (address.value) {
        return `${address.value.address}, ${address.value.commue}, ${address.value.district}, ${address.value.city}`;
    }
    return '';
});

const generateInvoice = () => {
    const docDefinition = {
        content: [
            { text: 'Hóa đơn', style: 'header' },
            { text: `Số: #${props.billId}` },
            { text: `Tên khách hàng: ${props.customerName}` },
            { text: `Ngày đặt: ${props.date}` },
            { text: `Địa chỉ: ${formattedAddress.value}` },
            {
                table: {
                    headerRows: 1,
                    widths: ['auto', '*', 'auto', 'auto', 'auto'],
                    body: [
                        ['STT', 'Sản phẩm', 'Số lượng', 'Giá', 'Thành tiền'],
                        ...props.items.order_detail.map((item, index) => [
                            index + 1,
                            item.product.product_name,
                            item.quantity,
                            formatCurrency(item.total_cost_detail / item.quantity),
                            formatCurrency(item.total_cost_detail)
                        ])
                    ]
                }
            },
            { text: `Phí vận chuyển: ${formatCurrency(props.items.shipping_fee)} `, style: 'subheader' },
            { text: `Tổng thanh toán: ${formatCurrency(props.items.total_cost)} `, style: 'subheader' }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                font: 'Roboto' // Use Roboto for header
            },
            subheader: {
                fontSize: 14,
                bold: true,
                font: 'Roboto' // Use Roboto for subheader
            }
        },
        defaultStyle: {
            font: 'Roboto' // Use Roboto as default font
        }
    };

    pdfMake.createPdf(docDefinition).download(`hoa-don-${props.billId}.pdf`);
};


// Xử lý khi component được mount
onMounted(() => {
    // Parse địa chỉ từ items
    if (props.items.order_address) {
        address.value = JSON.parse(props.items.order_address);
    }
});
</script>

<style scoped>
/* Thêm style cho hóa đơn nếu cần */
table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
}
</style>
