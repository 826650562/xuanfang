package com.clint.service;

import java.util.List;

public interface MapService {

	/**
	 * 查询SQL语句，结果直接返�? jdbctemplate
	 */
	public List<?> getListBySql(String sql);

	public void execute(String sql);

	public int countAll(String sql);

}
