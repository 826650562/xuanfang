package com.clint.dao.impl;

import javax.annotation.Resource;

import org.springframework.jdbc.core.JdbcTemplate;

import com.clint.dao.MapDao;

@SuppressWarnings("unchecked")
public class MapDaoImpl extends BaseDaoImpl implements MapDao {

	
	/**
	 * JdbcTemplate对象，通过Spring注入
	 */
	@Resource
	private JdbcTemplate jdbcTemplate;

	@Override
	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}

}
