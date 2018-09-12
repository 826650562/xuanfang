package com.clint.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.clint.dao.MapDao;
import com.clint.service.MapService;

@Service("mapService")
public class MapServiceImpl implements MapService {
	@Resource
	private MapDao mapDao;

	@Override
	public void execute(String sql) {
		mapDao.getJdbcTemplate().execute(sql);
		;
	}

	/**
	 * 查询SQL语句，结果直接返回 jdbctemplate
	 */
	@Override
	public List<?> getListBySql(String sql) {
		return mapDao.getJdbcTemplate().queryForList(sql);
	}

	@Override
	public int countAll(String sql) {
		return mapDao.getJdbcTemplate().queryForInt(sql);
	}

}
