import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
    User,
    Phone,
    Mail,
    MapPin,
    Calendar,
    Clock,
    Car,
    Users,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Navigation,
    XCircle,
} from "lucide-react";
import Logo from "./components/Logo";

// ============== INPUT WRAPPER COMPONENT (MOVED OUTSIDE) ==============
const InputWrapper = ({
    children,
    icon: Icon,
    label,
    name,
    rightIcon,
    required = true,
    customIcon,
    errors,
    touchedFields,
    focusedField,
}) => {
    const hasError = errors[name];
    const isTouched = touchedFields[name];
    const isValid = isTouched && !hasError;
    const isFocused = focusedField === name;

    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 ml-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className={`relative transition-all duration-300 ${isFocused ? "scale-[1.01]" : ""}`}>
                {/* Focus/Error Glow Effect */}
                <div
                    className={`absolute inset-0 rounded-xl blur-md transition-opacity duration-300 ${
                        hasError ? "bg-red-200/50 opacity-100" : isFocused ? "bg-blue-200/50 opacity-100" : "opacity-0"
                    }`}
                />

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        {customIcon || (
                            <Icon
                                className={`w-5 h-5 transition-colors duration-200 ${
                                    hasError ? "text-red-500" : isFocused ? "text-[#007BFF]" : "text-gray-400"
                                }`}
                            />
                        )}
                    </div>

                    {children}

                    {/* Validation Icons */}
                    {!rightIcon && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            {hasError ? (
                                <XCircle className="w-5 h-5 text-red-500" />
                            ) : isValid ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : null}
                        </div>
                    )}
                    {rightIcon}
                </div>
            </div>
            {hasError && (
                <p className="text-red-500 text-xs ml-1 flex items-center gap-1 animate-shake font-medium">
                    <AlertCircle className="w-3 h-3" />
                    {hasError.message}
                </p>
            )}
        </div>
    );
};

function App() {
    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields },
        reset,
        watch,
    } = useForm({
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            pickup: "",
            destination: "",
            date: "",
            time: "",
            vehicleType: "sedan",
            passengers: "1",
            notes: "",
        },
        mode: "onBlur",
    });

    const [status, setStatus] = useState({ type: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    // Watch values
    const watchDate = watch("date");

    // ============== VALIDATION UTILS ==============
    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 30);
        return maxDate.toISOString().split("T")[0];
    };

    // ============== SUBMIT HANDLER ==============
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setStatus({ type: "", message: "" });

        try {
            const response = await fetch("http://localhost:5000/api/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    date: `${data.date} at ${data.time}`,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setStatus({ type: "success", message: "Đã gửi yêu cầu thành công!" });
                reset();
            } else {
                setStatus({ type: "error", message: result.message || "Lỗi hệ thống." });
            }
        } catch (error) {
            setStatus({ type: "error", message: "Lỗi kết nối." });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Shared input class logic
    const getInputClass = (name) => {
        const hasError = errors[name];
        const isTouched = touchedFields[name];
        const isValid = isTouched && !hasError;

        return `w-full pl-11 pr-11 py-3 bg-gray-50 border rounded-xl outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 font-medium
            ${
                hasError
                    ? "border-red-300 focus:ring-4 focus:ring-red-100 focus:border-red-400 bg-red-50/30"
                    : isValid
                      ? "border-green-300 focus:ring-4 focus:ring-blue-50 focus:border-[#007BFF]"
                      : "border-gray-200 focus:ring-4 focus:ring-blue-50 focus:border-[#007BFF] hover:border-gray-300"
            }`;
    };

    // Helper validation props
    const commonInputProps = {
        errors,
        touchedFields,
        focusedField,
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-3 md:p-6 bg-[#F0F4F8] font-sans">
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-5 bg-white rounded-3xl shadow-[0_10px_40px_-12px_rgba(0,0,0,0.1)] overflow-hidden border border-white/50">
                {/* Left Side - Hero / Branding */}
                <div className="lg:col-span-2 bg-gradient-to-br from-[#003366] to-[#007BFF] p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden text-white">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10 text-center lg:text-left">
                        <div className="bg-white/10 backdrop-blur-md w-fit p-3 lg:p-4 rounded-2xl mb-6 shadow-inner ring-1 ring-white/20 mx-auto lg:mx-0">
                            <Logo className="w-16 h-16 lg:w-20 lg:h-20" />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold mb-3 leading-tight">
                            Đặt xe dễ dàng,
                            <br />
                            Di chuyển an toàn.
                        </h1>
                        <p className="text-blue-100 text-base lg:text-lg leading-relaxed">
                            Trải nghiệm dịch vụ cao cấp với đội ngũ tài xế chuyên nghiệp.
                        </p>
                    </div>

                    <div className="relative z-10 space-y-3 mt-8 lg:mt-12">
                        {/* <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">Uy tín hàng đầu</h3>
                                <p className="text-[10px] lg:text-xs text-blue-200">Hơn 10.000+ chuyến đi</p>
                            </div>
                        </div> */}
                        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <Clock className="w-4 h-4 text-cyan-300" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">Đúng giờ 24/7</h3>
                                <p className="text-[10px] lg:text-xs text-blue-200">Sẵn sàng phục vụ</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="lg:col-span-3 p-6 md:p-10 lg:p-14 bg-white">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Thông tin chuyến đi</h2>
                            <p className="text-gray-500 text-xs md:text-sm mt-1">
                                Vui lòng điền đầy đủ thông tin bên dưới
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <Car className="w-10 h-10 text-blue-100" />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <InputWrapper icon={User} label="Họ và Tên" name="name" {...commonInputProps}>
                                <input
                                    type="text"
                                    placeholder="Nguyễn Văn A"
                                    {...register("name", {
                                        required: "Vui lòng nhập họ và tên",
                                        minLength: { value: 2, message: "Tên quá ngắn" },
                                        maxLength: { value: 50, message: "Tên không quá 50 ký tự" },
                                        pattern: { value: /^[a-zA-ZÀ-ỹ\s]+$/, message: "Tên chỉ chứa chữ cái" },
                                    })}
                                    onFocus={() => setFocusedField("name")}
                                    onBlur={(e) => {
                                        register("name").onBlur(e);
                                        setFocusedField(null);
                                    }}
                                    className={getInputClass("name")}
                                />
                            </InputWrapper>

                            <InputWrapper icon={Phone} label="Số Điện Thoại" name="phone" {...commonInputProps}>
                                <input
                                    type="tel"
                                    placeholder="0912 345 678"
                                    {...register("phone", {
                                        required: "Vui lòng nhập số điện thoại",
                                        pattern: {
                                            value: /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
                                            message: "Số điện thoại không hợp lệ",
                                        },
                                    })}
                                    onFocus={() => setFocusedField("phone")}
                                    onBlur={(e) => {
                                        register("phone").onBlur(e);
                                        setFocusedField(null);
                                    }}
                                    className={getInputClass("phone")}
                                />
                            </InputWrapper>
                        </div>

                        <InputWrapper icon={Mail} label="Email" name="email" {...commonInputProps}>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                {...register("email", {
                                    required: "Vui lòng nhập email",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Email không hợp lệ",
                                    },
                                })}
                                onFocus={() => setFocusedField("email")}
                                onBlur={(e) => {
                                    register("email").onBlur(e);
                                    setFocusedField(null);
                                }}
                                className={getInputClass("email")}
                            />
                        </InputWrapper>

                        <div className="relative pl-6 md:pl-8 space-y-4 md:space-y-6 before:content-[''] before:absolute before:left-[15px] md:before:left-[19px] before:top-8 before:bottom-8 before:w-0.5 before:bg-gradient-to-b before:from-blue-200 before:to-gray-100">
                            <div className="relative">
                                <div className="absolute -left-[22px] md:-left-8 top-9 w-3 h-3 md:w-4 md:h-4 rounded-full border-[3px] border-blue-500 bg-white z-10"></div>
                                <InputWrapper icon={MapPin} label="Điểm Đón" name="pickup" {...commonInputProps}>
                                    <input
                                        type="text"
                                        placeholder="Nhập địa chỉ đón"
                                        {...register("pickup", {
                                            required: "Vui lòng nhập điểm đón",
                                            minLength: { value: 5, message: "Địa chỉ quá ngắn" },
                                        })}
                                        onFocus={() => setFocusedField("pickup")}
                                        onBlur={(e) => {
                                            register("pickup").onBlur(e);
                                            setFocusedField(null);
                                        }}
                                        className={getInputClass("pickup")}
                                    />
                                </InputWrapper>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[22px] md:-left-8 top-9 w-3 h-3 md:w-4 md:h-4 rounded-full border-[3px] border-gray-400 bg-white z-10"></div>
                                <InputWrapper
                                    icon={Navigation}
                                    label="Điểm Đến"
                                    name="destination"
                                    {...commonInputProps}
                                >
                                    <input
                                        type="text"
                                        placeholder="Nhập địa chỉ đến"
                                        {...register("destination", {
                                            required: "Vui lòng nhập điểm đến",
                                            minLength: { value: 5, message: "Địa chỉ quá ngắn" },
                                        })}
                                        onFocus={() => setFocusedField("destination")}
                                        onBlur={(e) => {
                                            register("destination").onBlur(e);
                                            setFocusedField(null);
                                        }}
                                        className={getInputClass("destination")}
                                    />
                                </InputWrapper>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:gap-6">
                            <InputWrapper icon={Calendar} label="Ngày Đón" name="date" {...commonInputProps}>
                                <input
                                    type="date"
                                    min={getMinDate()}
                                    max={getMaxDate()}
                                    {...register("date", {
                                        required: "Vui lòng chọn ngày",
                                        validate: (value) => {
                                            const selected = new Date(value);
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);
                                            return selected >= today || "Ngày không hợp lệ";
                                        },
                                    })}
                                    onClick={(e) => e.target.showPicker?.()}
                                    onFocus={() => setFocusedField("date")}
                                    onBlur={(e) => {
                                        register("date").onBlur(e);
                                        setFocusedField(null);
                                    }}
                                    className={`${getInputClass("date")} [color-scheme:light] cursor-pointer`}
                                />
                            </InputWrapper>

                            <InputWrapper icon={Clock} label="Giờ Đón" name="time" {...commonInputProps}>
                                <input
                                    type="time"
                                    {...register("time", {
                                        required: "Vui lòng chọn giờ",
                                        validate: (value) => {
                                            if (!watchDate) return true;
                                            const now = new Date();
                                            const selected = new Date(`${watchDate}T${value}`);
                                            const minTime = new Date(now.getTime() + 60 * 60 * 1000); // +1 hour buffer
                                            // Only validate time if date is today
                                            if (new Date(watchDate).toDateString() === now.toDateString()) {
                                                return selected > minTime || "Phải trước 1 tiếng";
                                            }
                                            return true;
                                        },
                                    })}
                                    onClick={(e) => e.target.showPicker?.()}
                                    onFocus={() => setFocusedField("time")}
                                    onBlur={(e) => {
                                        register("time").onBlur(e);
                                        setFocusedField(null);
                                    }}
                                    className={`${getInputClass("time")} [color-scheme:light] cursor-pointer`}
                                />
                            </InputWrapper>

                            <InputWrapper icon={Users} label="Số Khách" name="passengers" {...commonInputProps}>
                                <input
                                    type="number"
                                    min="1"
                                    max="16"
                                    {...register("passengers", {
                                        required: "Vui lòng nhập số khách",
                                        min: { value: 1, message: "Số khách 1-16" },
                                        max: { value: 16, message: "Số khách 1-16" },
                                    })}
                                    onFocus={() => setFocusedField("passengers")}
                                    onBlur={(e) => {
                                        register("passengers").onBlur(e);
                                        setFocusedField(null);
                                    }}
                                    className={getInputClass("passengers")}
                                />
                            </InputWrapper>
                        </div>

                        {/* Vehicle Selection - Optional */}
                        <div className="hidden">
                            <select {...register("vehicleType")}>
                                <option value="sedan">Sedan</option>
                            </select>
                        </div>

                        <div className="pt-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                                Ghi Chú Thêm
                            </label>
                            <textarea
                                placeholder="Ví dụ: Cần ghế trẻ em, nhiều hành lý..."
                                {...register("notes")}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#007BFF] transition-all text-gray-800 placeholder-gray-400 min-h-[100px] resize-none font-medium"
                            />
                        </div>

                        {status.message && (
                            <div
                                className={`p-4 rounded-xl flex items-center gap-3 ${status.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
                            >
                                {status.type === "success" ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                    <AlertCircle className="w-5 h-5" />
                                )}
                                <span className="font-medium">{status.message}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 md:py-4 bg-gradient-to-r from-[#003366] to-[#007BFF] hover:to-[#0056b3] text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/20 transform transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Đang xử lý...</span>
                                </>
                            ) : (
                                <span>Xác Nhận Đặt Chuyến</span>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            <p className="fixed bottom-4 text-gray-400 text-xs font-medium">© 2026 NAD Transport Service</p>
        </div>
    );
}

export default App;
