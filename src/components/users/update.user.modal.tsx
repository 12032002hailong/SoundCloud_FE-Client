import { Form, Input, InputNumber, Modal, Select, notification } from "antd";
import React, { useEffect, useState } from "react";
import { IUsers } from "./user.table";

const { Option } = Select;
interface IProps {
  access_token: string;
  getData: any;
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (v: boolean) => void;
  dataUpdate: null | IUsers;
  setDataUpdate: any;
}

const UpdateUserModal = (props: IProps) => {
  const {
    access_token,
    getData,
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    dataUpdate,
    setDataUpdate,
  } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        name: dataUpdate.name,
        email: dataUpdate.email,
        age: dataUpdate.age,
        address: dataUpdate.address,
        role: dataUpdate.role,
        gender: dataUpdate.gender,
      });
    }
  }, [dataUpdate]);

  const handleOk = async () => {};

  const handleCloseCreateModal = () => {
    setIsUpdateModalOpen(false);
    form.resetFields();
    setDataUpdate(null);
  };

  const onFinish = async (values: any) => {
    const { name, email, age, gender, role, address } = values;
    if (dataUpdate) {
      const data = {
        _id: dataUpdate._id,
        name,
        email,
        age,
        gender,
        role,
        address,
      };
      const res = await fetch("http://localhost:8000/api/v1/users", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data }),
      });

      const d = await res.json();
      if (d.data) {
        await getData();
        notification.success({
          message: "Cập nhật người dùng thanh cong",
        });
        handleCloseCreateModal();
      } else {
        notification.error({
          message: "Co loi xay ra",
          description: JSON.stringify(d.message),
        });
      }
    }
  };

  return (
    <Modal
      title="Basic Modal"
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={() => handleCloseCreateModal()}
      maskClosable={false}
    >
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        form={form}
      >
        <Form.Item
          style={{ marginBottom: 5 }}
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 5 }}
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          style={{ marginBottom: 5 }}
          label="Password"
          name="password"
          rules={[
            {
              required: dataUpdate ? false : true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password disabled={dataUpdate ? true : false} />
        </Form.Item>
        <Form.Item
          style={{ marginBottom: 5 }}
          label="Age"
          name="age"
          rules={[{ required: true, message: "Please input your age!" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          style={{ marginBottom: 5 }}
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please input your address!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true }]}
          style={{ marginBottom: 5 }}
        >
          <Select
            placeholder="Select a option and change input text above"
            allowClear
          >
            <Option value="MALE">male</Option>
            <Option value="FEMALE">female</Option>
            <Option value="OTHER">other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true }]}
          style={{ marginBottom: 5 }}
        >
          <Select
            placeholder="Select a option and change input text above"
            allowClear
          >
            <Option value="USER">User</Option>
            <Option value="ADMIN">Admin</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>

    // <Modal
    //   title="Basic Modal"
    //   open={isUpdateModalOpen}
    //   onOk={handleOk}
    //   onCancel={() => handleCloseCreateModal()}
    //   maskClosable={false}
    // >
    //   <div>
    //     <label> Name:</label>
    //     <Input value={name} onChange={(event) => setName(event.target.value)} />
    //   </div>
    //   <div>
    //     <label>Email:</label>
    //     <Input
    //       value={email}
    //       onChange={(event) => setEmail(event.target.value)}
    //     />
    //   </div>
    //   <div>
    //     <label>Password:</label>
    //     <Input
    //       disabled
    //       value={password}
    //       onChange={(event) => setPassword(event.target.value)}
    //     />
    //   </div>
    //   <div>
    //     <label>Age:</label>
    //     <Input value={age} onChange={(event) => setAge(event.target.value)} />
    //   </div>
    //   <div>
    //     <label>Gender:</label>
    //     <Input
    //       value={gender}
    //       onChange={(event) => setGender(event.target.value)}
    //     />
    //   </div>
    //   <div>
    //     <label>Address:</label>
    //     <Input
    //       value={address}
    //       onChange={(event) => setAddress(event.target.value)}
    //     />
    //   </div>
    //   <div>
    //     <label>Role:</label>
    //     <Input value={role} onChange={(event) => setRole(event.target.value)} />
    //   </div>
    // </Modal>
  );
};

export default UpdateUserModal;
