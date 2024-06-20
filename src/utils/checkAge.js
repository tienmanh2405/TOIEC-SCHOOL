export const checkAge =  (NgaySinh) => {
    const currentDate = new Date();
    const birthDate = new Date(NgaySinh);
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
        age--;
    }

    if (age < 18) {
        return false;
    }

    return true;
}