package org.example.be;

import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.sql.DataSource;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@Log4j2
@SpringBootTest
public class UserTrackerSpringBootApplicationTests {

    @Autowired
    private DataSource dataSource;

    @Test
    public void contextLoads() {
        assertThat(dataSource.getClass().getName()).isEqualTo("com.zaxxer.hikari.HikariDataSource");
    }

    @Test
    public void testDbConnection() throws SQLException {
        // TODO: Implement test for database connection
        ResultSet rs = null;
        int noOfCourses = 0;
        try(PreparedStatement ps =
                dataSource.getConnection().prepareStatement("SELECT COUNT(*) FROM users")) {
            rs = ps.executeQuery();
            if (rs.next()) {
                noOfCourses = rs.getInt(1);
            }
            assertThat(noOfCourses).isGreaterThan(0);
        }
        finally {
            if (rs != null) try { rs.close(); } catch (SQLException e) {
                log.error("e: ", e);
            }
        }
    }
}
