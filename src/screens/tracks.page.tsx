import { Button, Popconfirm, notification } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

export interface ITracks {
  _id: string;
  title: string;
  description: string;
  category: string;
  imgUrl: string;
  trackUrl: string;
  countLike: number;
  countPlay: number;
}

const TracksPage = () => {
  const [listTracks, setListTracks] = useState([]);
  const access_token = localStorage.getItem("access_token") as string;

  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = await fetch(
      `http://localhost:8000/api/v1/tracks?current=${meta.current}&pageSize=${meta.pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data1 = await res.json();
    if (!data1.data) {
      notification.error({
        message: JSON.stringify(data1.message),
      });
    }
    setListTracks(data1.data.result);
    setMeta({
      current: data1.data.meta.current,
      pageSize: data1.data.meta.pageSize,
      pages: data1.data.meta.pages,
      total: data1.data.meta.total,
    });
  };
  const confirm = async (tracks: ITracks) => {
    const res = await fetch(
      `http://localhost:8000/api/v1/tracks/${tracks._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const d = await res.json();
    if (d.data) {
      notification.success({
        message: "Xoa Tracks thanh cong",
      });
    } else {
      notification.error({
        message: JSON.stringify(d.message),
      });
    }
    await getData();
  };

  const columns: ColumnsType<ITracks> = [
    {
      dataIndex: "_id",
      title: "STT",
      render: (value, record, index) => {
        return <>{(meta.current - 1) * meta.pageSize + index + 1} </>;
      },
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Track url",
      dataIndex: "trackUrl",
    },
    {
      title: "Uploader",
      dataIndex: ["uploader", "name"],
    },

    {
      title: "Actions",
      render: (value, record) => {
        return (
          <div>
            <Popconfirm
              title="Delete the task"
              description={`Are you sure to delete user name = ${record.title}`}
              onConfirm={() => confirm(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger style={{ marginLeft: 20 }}>
                Delete
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const handleOnChange = async (page: number, pageSize: number) => {
    const res = await fetch(
      `http://localhost:8000/api/v1/tracks?current=${page}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data1 = await res.json();
    if (!data1.data) {
      notification.error({
        message: JSON.stringify(data1.message),
      });
    }
    setListTracks(data1.data.result);
    setMeta({
      current: data1.data.meta.current,
      pageSize: data1.data.meta.pageSize,
      pages: data1.data.meta.pages,
      total: data1.data.meta.total,
    });
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ color: "#c94087" }}>Tracks</h2>
      </div>

      <Table
        columns={columns}
        dataSource={listTracks}
        rowKey={"_id"}
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          total: meta.total,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page: number, pageSize: number) =>
            handleOnChange(page, pageSize),
          showSizeChanger: true,
        }}
      />
    </>
  );
};

export default TracksPage;
