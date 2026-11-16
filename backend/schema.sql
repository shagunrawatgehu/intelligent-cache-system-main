CREATE DATABASE IF NOT EXISTS cache_prediction_db;
USE cache_prediction_db;

CREATE TABLE IF NOT EXISTS simulations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cache_size INT NOT NULL,
    reference_string TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS simulation_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    simulation_id INT NOT NULL,
    request_order INT NOT NULL,
    page_number INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_requests_simulation 
        FOREIGN KEY (simulation_id) REFERENCES simulations(id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_sim_request_order (simulation_id, request_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS algorithm_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    simulation_id INT NOT NULL,
    algorithm_name VARCHAR(50) NOT NULL,
    hits INT NOT NULL DEFAULT 0,
    misses INT NOT NULL DEFAULT 0,
    hit_ratio DECIMAL(6, 4) NOT NULL DEFAULT 0.0000,
    memory_overhead VARCHAR(50) DEFAULT '0 KB',
    execution_time DECIMAL(10, 4) NOT NULL DEFAULT 0.0000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_results_simulation 
        FOREIGN KEY (simulation_id) REFERENCES simulations(id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_sim_algorithm (simulation_id, algorithm_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS cache_states (
    id INT AUTO_INCREMENT PRIMARY KEY,
    simulation_id INT NOT NULL,
    algorithm_name VARCHAR(50) NOT NULL,
    request_order INT NOT NULL,
    page_number INT NOT NULL,
    cache_state JSON NOT NULL,
    result ENUM('HIT', 'MISS') NOT NULL,
    evicted_page INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_states_simulation 
        FOREIGN KEY (simulation_id) REFERENCES simulations(id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_sim_algo_order (simulation_id, algorithm_name, request_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
