## Esquema para la creación de la base de datos en SQL SERVER

#### Tabla de Notas

```sql
CREATE TABLE Notes (
    NoteId INT IDENTITY PRIMARY KEY,
    Title NVARCHAR(255) NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    IsArchived BIT NOT NULL DEFAULT 0
);
```

### Tabla de Categorías

```sql
CREATE TABLE Categories (
    CategoryId INT IDENTITY PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL
);

INSERT INTO Categories (Name) 
    VALUES ('trabajo'), ('estudio'), ('medicos'), ('recreacion'), ('otros');
```

### Tabla de Relación entre Notas y Categorías

```sql
CREATE TABLE NoteCategories (
    NoteId INT,
    CategoryId INT,
    PRIMARY KEY (NoteId, CategoryId),
    FOREIGN KEY (NoteId) REFERENCES Notes(NoteId),
    FOREIGN KEY (CategoryId) REFERENCES Categories(CategoryId)
);
```