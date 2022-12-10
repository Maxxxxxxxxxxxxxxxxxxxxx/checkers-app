#[derive(Debug, Copy, Clone, Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct Vector {
    x: i32,
    y: i32,
}

impl Vector {
    pub fn new(x: i32, y: i32) -> Self {
        Vector { x, y }
    }
    pub fn abs_between(start: &Self, end: &Self) -> Self {
        let x = i32::abs(start.x - end.x);
        let y = i32::abs(start.y - end.y);
        Vector { x, y }
    }
    pub fn between(start: &Self, end: &Self) -> Self {
        let absolute = Self::abs_between(start, end);
        match (start.x < end.x, start.y < end.y) {
            (true, true) => absolute,
            (true, false) => Vector::new(absolute.x, -absolute.y),
            (false, true) => Vector::new(-absolute.x, absolute.y),
            (false, false) => absolute * -1,
        }
    }
}

impl PartialEq for Vector {
    fn eq(&self, other: &Self) -> bool {
        if self.y == other.y && self.x == other.x {
            true
        } else {
            false
        }
    }
    fn ne(&self, other: &Self) -> bool {
        if self.x != other.x || self.y != other.y {
            true
        } else {
            false
        }
    }
}

impl Add for Vector {
    type Output = Self;
    fn add(self, rhs: Self) -> Self::Output {
        Vector {
            x: self.x + rhs.x,
            y: self.y + rhs.y,
        }
    }
}

impl Sub for Vector {
    type Output = Self;
    fn sub(self, rhs: Self) -> Self::Output {
        Vector {
            x: self.x - rhs.x,
            y: self.y - rhs.y,
        }
    }
}

impl Mul<i32> for Vector {
    type Output = Self;
    fn mul(self, rhs: i32) -> Self::Output {
        Vector {
            x: self.x * rhs,
            y: self.y * rhs,
        }
    }
}

impl Div<i32> for Vector {
    type Output = Self;
    fn div(self, rhs: i32) -> Self::Output {
        Vector {
            x: self.x / rhs,
            y: self.y / rhs,
        }
    }
}