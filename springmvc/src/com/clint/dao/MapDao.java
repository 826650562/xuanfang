package com.clint.dao;

import org.springframework.jdbc.core.JdbcTemplate;

public interface MapDao extends BaseDao {

	/**
	 * 获取JdbcTemplate对象，用于复杂查询时直接使用SQL语句
	 * 
	 *
	 * @return JdbcTemplate
	 */
	@Override
	public JdbcTemplate getJdbcTemplate();

}
