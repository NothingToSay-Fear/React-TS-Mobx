import { FC, useState } from 'react'
import {
  Button,
  Form,
  FormProps,
  Input,
  InputNumber,
  Modal,
  Table,
  type TableColumnsType,
  type TableProps
} from 'antd'
import './Home.scss'

type TableRowSelection<T extends object = object> =
  TableProps<T>['rowSelection']

interface DataType {
  key: React.Key
  name: string
  age: number
  address: string
}

type FieldType = {
  Name: string
  Age: number
  Address: string
}

const columns: TableColumnsType<DataType> = [
  { title: 'Name', dataIndex: 'name' },
  { title: 'Age', dataIndex: 'age' },
  { title: 'Address', dataIndex: 'address' }
]

const dataSource = Array.from<DataType>({ length: 46 }).map<DataType>(
  (_, i) => ({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`
  })
)

const Home: FC<any> = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const [source, setSource] = useState<DataType[]>(dataSource)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [form] = Form.useForm<FieldType>()

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    form.resetFields()
    setIsModalOpen(false)
  }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange
  }

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    dataSource.unshift({
      key: dataSource.length + 1,
      name: values['Name'],
      age: values['Age'],
      address: values['Address']
    })

    setSource([...dataSource])

    form.resetFields()

    setIsModalOpen(false)
  }

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
    errorInfo
  ) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div className='Home_container'>
      <div className='Home_top'>
        <Button onClick={showModal}>新增</Button>
      </div>
      <Modal
        title='新增记录'
        width={700}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}>
        <Form
          form={form}
          name='basic'
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 800 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'>
          <Form.Item<FieldType>
            label='名称'
            name='Name'
            rules={[{ required: true, message: '请输入名称' }]}>
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label='年龄'
            name='Age'
            rules={[{ required: true, type: 'number', message: '请输入年龄' }]}>
            <InputNumber />
          </Form.Item>

          <Form.Item<FieldType>
            label='地址'
            name='Address'
            rules={[{ required: true, message: '请输入地址' }]}>
            <Input />
          </Form.Item>

          <Form.Item label={null}>
            <Button type='primary' htmlType='submit'>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <div className='Home_table'>
        <Table<DataType>
          className='table'
          rowSelection={rowSelection}
          scroll={{ y: 'calc(100vh - 250px)' }}
          columns={columns}
          dataSource={source}
        />
      </div>
    </div>
  )
}

export default Home
