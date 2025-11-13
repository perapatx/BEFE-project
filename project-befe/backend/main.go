package main

import (
	"database/sql"
	"fmt"
	_ "backend/docs"

	"log"
	"os"
	"time"

	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	"github.com/gin-contrib/cors"
)

type ErrorResponse struct {
	Message string `json:"message"`
}

type Boardgames struct {
	ID     int     `json:"id"`
	Title  string  `json:"title"`
	Creater string  `json:"creater"`
	Publisher   string  `json:"publisher"`
	Category      string   `json:"category"`
	
	Year   int     `json:"year"`
	Description   string   `json:"description"`
	Price  float64 `json:"price"`

	// ฟิลด์ใหม่
	OriginalPrice *float64 `json:"original_price,omitempty"`
	Discount      int      `json:"discount"`
	Stock  int      `json:"stock"`
	Rating        float64  `json:"rating"`
	ReviewsCount  int      `json:"reviews_count"`
	IsNew         bool     `json:"is_new"`

	Min_Player  int      `json:"min_players"`
	Max_Player  int      `json:"max_players"`
	Language      string   `json:"language"`
	CoverImage    string   `json:"cover_image"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

var db *sql.DB

func initDB() {
	var err error

	host := getEnv("DB_HOST", "")
	name := getEnv("DB_NAME", "")
	user := getEnv("DB_USER", "")
	password := getEnv("DB_PASSWORD", "")
	port := getEnv("DB_PORT", "")

	conSt := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, name)
	//fmt.Println(conSt)
	db, err = sql.Open("postgres", conSt)
	if err != nil {
		log.Fatal("failed to open")
	}
	// กำหนดจำนวน Connection สูงสุด
	db.SetMaxOpenConns(25)

	// กำหนดจำนวน Idle connection สูงสุด
	db.SetMaxIdleConns(20)

	// กำหนดอายุของ Connection
	db.SetConnMaxLifetime(5 * time.Minute)
	err = db.Ping()
	if err != nil {
		log.Fatal("failed to connect to database")
	}
	log.Println("successfully connected to database")
}

// @Summary Get all boardgames
// @Description Get all boardgames
// @Tags BoardGame
// @Produce  json
// @Success 200  {array}  Boardgames
// @Failure 500  {object}  ErrorResponse
// @Router  /boardgames [get]
func getAllBoardGame(c *gin.Context) {
	var rows *sql.Rows
	var err error
	// ลูกค้าถาม "มีหนังสืออะไรบ้าง"
	rows, err = db.Query("SELECT id, title, creater, publisher, year, price, created_at, updated_at FROM board_games")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close() // ต้องปิด rows เสมอ เพื่อคืน Connection กลับ pool

	var boardgames []Boardgames
	for rows.Next() {
		var bg Boardgames
		err := rows.Scan(&bg.ID, &bg.Title, &bg.Creater, &bg.Publisher, &bg.Year, &bg.Price, &bg.CreatedAt, &bg.UpdatedAt)
		if err != nil {
			// handle error
		}
		boardgames = append(boardgames, bg)
	}
	if boardgames == nil {
		boardgames = []Boardgames{}
	}
	c.JSON(http.StatusOK, boardgames)
}

// @Summary Get Boardgame by Id
// @Description Get detail of getDetail of Boardgame
// @Tags BoardGame
// @Produce  json
// @Param   id   path      int     true  "Boardgame ID"
// @Success 200 {object} Boardgames
// @Failure 500  {object}  ErrorResponse
// @Router /boardgames/{id} [get]
func getBoardGame(c *gin.Context) {
	id := c.Param("id")
	var bg Boardgames

	err := db.QueryRow("SELECT id, title, creater, publisher, year, price,min_players,max_players, created_at, updated_at FROM board_games WHERE id = $1", id).
		Scan(&bg.ID, &bg.Title, &bg.Creater, &bg.Publisher, &bg.Year, &bg.Price,&bg.Min_Player,&bg.Max_Player, &bg.CreatedAt, &bg.UpdatedAt)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "boardgame not found"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, bg)
}

// @Summary Create a new boardgame
// @Description Add a new boardgame to the database
// @Tags BoardGame
// @Accept json
// @Produce json
// @Param boardgame body Boardgames true "Boadgames details"
// @Success 201 {object} Boardgames
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /boardgames [post]
func createBoardGame(c *gin.Context) {
	var newBG Boardgames

	if err := c.ShouldBindJSON(&newBG); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ใช้ RETURNING เพื่อดึงค่าที่ database generate (id, timestamps)
	var id int
	var createdAt, updatedAt time.Time

	err := db.QueryRow(`
		INSERT INTO board_games (
			title, creater, publisher, category, year, description,
			price, stock, rating, reviews_count, is_new,
			min_players, max_players, language
		) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
		RETURNING id, created_at, updated_at
	`,
		newBG.Title,
		newBG.Creater,
		newBG.Publisher,
		newBG.Category,
		newBG.Year,
		newBG.Description,
		newBG.Price,
		newBG.Stock,
		newBG.Rating,
		newBG.ReviewsCount,
		newBG.IsNew,
		newBG.Min_Player,
		newBG.Max_Player,
		newBG.Language,
	).Scan(&id, &createdAt, &updatedAt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	newBG.ID = id
	newBG.CreatedAt = createdAt
	newBG.UpdatedAt = updatedAt

	c.JSON(http.StatusCreated, newBG) // ใช้ 201 Created
}

// @Summary Update an existing boardgame
// @Description Update a book’s details using its ID
// @Tags BoardGame
// @Accept json
// @Produce json
// @Param id path int true "BoardGame ID"
// @Param Boardgame body Boardgames true "Updated BoardGame details"
// @Success 200 {object} Boardgames
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /boardgames/{id} [put]
func updateBoardGame(c *gin.Context) {
	var ID int
	id := c.Param("id")
	var updateBG Boardgames

	if err := c.ShouldBindJSON(&updateBG); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
// --title, creater, publisher, category, year, description,
// 			price, stock, rating, reviews_count, is_new,
// 			min_players, max_players, language
	var updatedAt time.Time
	err := db.QueryRow(
		`UPDATE board_games
         SET title = $1, creater = $2, publisher = $3, category = $4, year = $5
		 , price = $6, description = $7, stock = $8, min_players= $9, max_players=$10 
         WHERE id = $11
         RETURNING id , updated_at`,
		updateBG.Title, updateBG.Creater, updateBG.Publisher,updateBG.Category,
		updateBG.Year, updateBG.Price,updateBG.Description,updateBG.Stock,updateBG.Min_Player,updateBG.Max_Player, id,
	).Scan(&id,&updatedAt)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "boardgame not found"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	updateBG.ID = ID
	updateBG.UpdatedAt = updatedAt
	c.JSON(http.StatusOK, updateBG)
}

// @Summary Delete a board game
// @Description Remove a board game from the database by ID
// @Tags BoardGame
// @Produce json
// @Param id path int true "BoardGame ID"
// @Success 200 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /boardgames/{id} [delete]
func deleteBoardGame(c *gin.Context) {
	id := c.Param("id")

	result, err := db.Exec("DELETE FROM board_games WHERE id = $1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "board game not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "board game deleted successfully"})
}

// @Summary Get all unique board game categories
// @Description Return a list of unique categories from board_games
// @Tags Categories
// @Produce json
// @Success 200 {array} string
// @Router /categories [get]
func getCategories(c *gin.Context) {
	rows, err := db.Query(`SELECT DISTINCT category FROM board_games WHERE category IS NOT NULL AND category <> '' ORDER BY category`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var categories []string
	for rows.Next() {
		var cat string
		if err := rows.Scan(&cat); err == nil {
			categories = append(categories, cat)
		}
	}

	c.JSON(http.StatusOK, categories)
}

// @Summary Search board games
// @Description Search board games by title or creator
// @Tags BoardGame
// @Produce json
// @Param q query string true "Keyword to search (title or creator)"
// @Success 200 {array} Boardgames
// @Router /boardgames/search [get]
func searchBoardGame(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing query parameter q"})
		return
	}

	rows, err := db.Query(`
		SELECT id, title, creater, publisher, category, year, description, price, stock,
			   rating, reviews_count, is_new, min_players, max_players, language, cover_image, created_at, updated_at
		FROM board_games
		WHERE title ILIKE '%' || $1 || '%' OR creater ILIKE '%' || $1 || '%'`, query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var games []Boardgames
	for rows.Next() {
		var g Boardgames
		rows.Scan(
			&g.ID, &g.Title, &g.Creater, &g.Publisher, &g.Category, &g.Year, &g.Description, &g.Price, &g.Stock,
			&g.Rating, &g.ReviewsCount, &g.IsNew, &g.Min_Player, &g.Max_Player, &g.Language, &g.CoverImage, &g.CreatedAt, &g.UpdatedAt,
		)
		games = append(games, g)
	}

	c.JSON(http.StatusOK, games)
}

// @Summary Get featured board games
// @Description Get board games with rating >= 4.5
// @Tags BoardGame
// @Produce json
// @Success 200 {array} Boardgames
// @Router /boardgames/featured [get]
func getFeaturedBoardGame(c *gin.Context) {
	rows, err := db.Query(`
		SELECT id, title, creater, publisher, category, year, description, price, stock,
			   rating, reviews_count, is_new, min_players, max_players, language, cover_image, created_at, updated_at
		FROM board_games
		WHERE rating >= 4.5
		ORDER BY rating DESC LIMIT 10`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var games []Boardgames
	for rows.Next() {
		var g Boardgames
		rows.Scan(
			&g.ID, &g.Title, &g.Creater, &g.Publisher, &g.Category, &g.Year, &g.Description, &g.Price, &g.Stock,
			&g.Rating, &g.ReviewsCount, &g.IsNew, &g.Min_Player, &g.Max_Player, &g.Language, &g.CoverImage, &g.CreatedAt, &g.UpdatedAt,
		)
		games = append(games, g)
	}

	c.JSON(http.StatusOK, games)
}

// @Summary Get newly added board games
// @Description Get most recently added board games
// @Tags BoardGame
// @Produce json
// @Success 200 {array} Boardgames
// @Router /boardgames/new [get]
func getNewBoardGame(c *gin.Context) {
	rows, err := db.Query(`
		SELECT id, title, creater, publisher, category, year, description, price, stock,
			   rating, reviews_count, is_new, min_players, max_players, language, cover_image, created_at, updated_at
		FROM board_games
		WHERE is_new = true
		ORDER BY created_at DESC LIMIT 10`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var games []Boardgames
	for rows.Next() {
		var g Boardgames
		rows.Scan(
			&g.ID, &g.Title, &g.Creater, &g.Publisher, &g.Category, &g.Year, &g.Description, &g.Price, &g.Stock,
			&g.Rating, &g.ReviewsCount, &g.IsNew, &g.Min_Player, &g.Max_Player, &g.Language, &g.CoverImage, &g.CreatedAt, &g.UpdatedAt,
		)
		games = append(games, g)
	}

	c.JSON(http.StatusOK, games)
}

// @Summary Get discounted board games
// @Description Get board games with discount > 0
// @Tags BoardGame
// @Produce json
// @Success 200 {array} Boardgames
// @Router /boardgames/discounted [get]
func getDiscountedBoardGame(c *gin.Context) {
	rows, err := db.Query(`
		SELECT id, title, creater, publisher, category, year, description, price, original_price, discount, stock,
			   rating, reviews_count, is_new, min_players, max_players, language, cover_image, created_at, updated_at
		FROM board_games
		WHERE discount > 0
		ORDER BY discount DESC LIMIT 10`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var games []Boardgames
	for rows.Next() {
		var g Boardgames
		rows.Scan(
			&g.ID, &g.Title, &g.Creater, &g.Publisher, &g.Category, &g.Year, &g.Description, &g.Price, &g.OriginalPrice, &g.Discount, &g.Stock,
			&g.Rating, &g.ReviewsCount, &g.IsNew, &g.Min_Player, &g.Max_Player, &g.Language, &g.CoverImage, &g.CreatedAt, &g.UpdatedAt,
		)
		games = append(games, g)
	}

	c.JSON(http.StatusOK, games)
}


// @title           Simple API Example
// @version         1.0
// @description     This is a simple example of using Gin with Swagger.
// @host            localhost:8080
// @BasePath        /api/v1
func main() {
	initDB()
	defer db.Close()
	r := gin.Default()
	r.Use(cors.Default())

	// Swagger endpoint
	r.GET("/docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	r.GET("/health", func(c *gin.Context) {
		err := db.Ping()
		if err != nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{"message": "unhealthy", "error": err})
			return
		}
		c.JSON(200, gin.H{"message": "healthy"})
	})

	api := r.Group("/api/v1")
	{
		api.GET("/boardgames", getAllBoardGame)
		api.GET("/boardgames/:id", getBoardGame)
		api.POST("/boardgames", createBoardGame)
		api.PUT("/boardgames/:id", updateBoardGame)
		api.DELETE("/boardgames/:id", deleteBoardGame)
		api.GET("/categories", getCategories)
		api.GET("/boardgames/search", searchBoardGame)
		api.GET("/boardgames/featured", getFeaturedBoardGame)
		api.GET("/boardgames/new", getNewBoardGame)
		api.GET("/boardgames/discounted", getDiscountedBoardGame)
	}

	r.Run(":8080")
}
