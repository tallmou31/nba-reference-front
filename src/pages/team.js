import { SearchOutlined } from '@ant-design/icons';
import { Card, Input, List, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function TeamPage() {
  const { entities, loading } = useSelector((state) => state.team);

  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (filter && filter.trim().length > 0) {
      setFilteredData(
        entities.filter((e) =>
          e.name.toLowerCase().includes(filter.toLowerCase())
        )
      );
    } else {
      setFilteredData(entities);
    }
  }, [entities, filter]);

  return (
    <div>
      <div className='pt-3 mb-5 flex justify-between items-center'>
        <h1 className='font-bold text-xl'>Liste des équipes</h1>
        <Input
          addonAfter={<SearchOutlined />}
          className='search-field'
          placeholder='Rechercher'
          onChange={(e) => {
            setFilter(e.target.value);
          }}
        />
      </div>
      <List
        className='list-team'
        loading={loading}
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 6,
          xxl: 3,
        }}
        dataSource={filteredData}
        renderItem={(item) => (
          <List.Item className='h-full'>
            <Card
              className='cursor-pointer h-full flex justify-center items-center flex-col gap-5'
              onClick={() =>
                navigate({
                  pathname: '/teams/byName',
                  search: `?${new URLSearchParams({
                    name: item.name,
                  })}`,
                })
              }
            >
              <h1 className='font-bold text-lg text-center'>{item.name}</h1>
              <span className='flex gap-1 justify-center'>
                {item.abbr.map((a) => (
                  <Tag key={a} color='gold'>
                    {a}
                  </Tag>
                ))}
              </span>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}

export default TeamPage;
